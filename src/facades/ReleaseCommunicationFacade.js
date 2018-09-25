const idx = require('idx');
const nconf = require('nconf');
const { uniq } = require('lodash');
const {
  getPullRequestHandler,
  getTagsHandler,
  getTagDiffHandler,
  postMessageHandler,
  searchIssuesByCommitHandler,
} = require('../handlers');
const { groupFinder, getTagDiffFromTagId } = require('../utils');

const PR_TEMPLATE_COMMENT_REGEX = new RegExp(/<!--[\s\S]*?-->/, 'gm');
const regex = nconf.get('regex') || /(?:\[|https:\/\/jira\..*\.com\/browse\/)([A-Z0-9]+-[0-9]+)\]?/;
const JIRA_REGEX = new RegExp(regex, 'g');
const SQUASH_PR_REGEX = new RegExp(/\(#(.*)\)/, 'g');

class ReleaseCommunication {
  constructor({
    owner, repo, channel, channelUrl = null, tagId = null,
  }) {
    this.owner = owner;
    this.repo = repo;
    this.channel = channel;
    this.channelUrl = channelUrl;
    this.tagId = tagId;
  }

  /**
   * async diff - Returns the diff of the last two tags of a repo
   *
   * @return {Object}  diff https://developer.github.com/v3/repos/commits/#compare-two-commits
   */
  async diff() {
    const tags = await getTagsHandler(this.owner, this.repo);
    let head = '';
    let base = '';

    if (!tags.length || tags.length < 2) throw Error(`Could not find tags for ${this.owner}/${this.repo}`);

    head = tags[0].name;
    base = tags[1].name;

    if (this.tagId) {
      const { head: filteredHead, base: filteredBase } = getTagDiffFromTagId(this.tagId, tags);

      head = filteredHead;
      base = filteredBase;
    }

    const tagDiff = await getTagDiffHandler(this.owner, this.repo, head, base);

    return tagDiff;
  }

  /**
   * async parseDiff - parses out all of the pull request bodies from a given diff
   *
   * @param  {Object} diff an object containing the diff of two tags
   * @return {Array}      array containing objects of each message its corresponding PR and JIRA ticket number
   */
  async parseDiff(diff = {}) {
    const { commits = [] } = diff;
    const nonSquashedPRs = [];

    const pullRequestNumbers = commits.reduce((acc, commit) => {
      let prNumber = null;

      const message = idx(commit, _ => _.commit.message) || '';

      try {
        SQUASH_PR_REGEX.lastIndex = 0;
        prNumber = SQUASH_PR_REGEX.exec(message);
      } catch (e) {
        throw e;
      }

      if (prNumber) return [...acc, prNumber[1]];

      nonSquashedPRs.push(idx(commit, _ => _.sha));

      return acc;
    }, []);

    if (nonSquashedPRs.length) {
      const prNumbersByCommit = await Promise.all(nonSquashedPRs.map(async commit => searchIssuesByCommitHandler(commit)));
      // There should only ever be one issue for a commit
      prNumbersByCommit.forEach(pr => pullRequestNumbers.push(idx(pr, _ => _.items[0].number)));
    }

    // Uniq the array and remove falsy elements
    const uniquePRNumbers = uniq(pullRequestNumbers).filter(n => n);

    const pullRequests = await Promise.all(uniquePRNumbers.map(async prNum => getPullRequestHandler(this.owner, this.repo, prNum)));

    const pullRequestMessages = pullRequests.map((pr) => {
      const noCommentBody = pr.body.replace(PR_TEMPLATE_COMMENT_REGEX, '');
      const jiraTickets = uniq(groupFinder(JIRA_REGEX, noCommentBody) || []);
      return {
        number: pr.number,
        message: pr.body,
        jiraTickets,
        title: pr.title,
      };
    });

    return pullRequestMessages;
  }

  /**
   * async sendMessage - Send slack message to desired channel
   *
   * @param  {String} text text to send to channel
   * @param  {String} channelOverride  desired channel if it is not what exists in the constructor
   * @return {Object} response object from the posted message https://slackapi.github.io/node-slack-sdk/web_api
   */
  async sendMessage(text, attachments) {
    const response = await postMessageHandler({
      channel: this.channel,
      text,
      attachments,
      channelUrl: this.channelUrl,
    });

    return response;
  }
}

module.exports = ReleaseCommunication;
