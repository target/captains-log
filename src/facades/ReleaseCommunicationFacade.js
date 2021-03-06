const idx = require('idx');
const { uniq } = require('lodash');
const {
  getPullRequestHandler,
  getTagsHandler,
  getTagDiffHandler,
  postMessageHandler,
  searchIssuesByCommitHandler,
} = require('../handlers');
const { getTagDiffFromTagId, ticketFinder } = require('../utils');

const PR_TEMPLATE_COMMENT_REGEX = new RegExp(/<!--[\s\S]*?-->/, 'gm');
const STRIP_IGNORE_TICKETS = new RegExp(/<!--.+?icl.+?-->([\S\s.]*?)<!--.+?ecl.+?-->/, 'gm');
const STRIP_IGNORE_TICKETS_LONG = new RegExp(
  /<!--.+?captains-log-ignore.+?-->([\S\s.]*?)<!--.+?end-captains-log-ignore.+?-->/,
  'gm',
);

const SQUASH_PR_REGEX = new RegExp(/\(#(.*)\)/, 'g');

class ReleaseCommunication {
  constructor({ owner, repo, channel, channelUrl = null, tagId = null }) {
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
    return { diff: tagDiff, head, base };
  }

  async getUniquePullRequestsFromDiff(diff = {}) {
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
      let prNumbersByCommit = [];

      // Should allow execution to continue for repositories that use a different merge method.
      try {
        prNumbersByCommit = await Promise.all(nonSquashedPRs.map(async commit => searchIssuesByCommitHandler(commit)));
      } catch (error) {
        console.error('Unable to retrieve issues by commit. Check if API limit was exceeded.', error);
      }

      // There should only ever be one issue for a commit
      prNumbersByCommit.forEach(pr => pullRequestNumbers.push(idx(pr, _ => _.items[0].number)));
    }

    // Uniq the array and remove falsy elements
    const uniquePRNumbers = uniq(pullRequestNumbers).filter(n => n);

    const pullRequests = await Promise.all(
      uniquePRNumbers.map(async prNum => getPullRequestHandler(this.owner, this.repo, prNum)),
    );

    return { pullRequests, prNumbers: uniquePRNumbers };
  }

  /**
   * async parseDiff - parses out all of the pull request bodies from a given diff
   *
   * @param  {Object} diff an object containing the diff of two tags
   * @return {Array}      array containing objects of each message its corresponding PR and JIRA ticket number
   */
  async parseDiff(diff = {}) {
    const { pullRequests } = await this.getUniquePullRequestsFromDiff(diff);

    const pullRequestMessages = Promise.all(
      pullRequests.map(async pr => {
        // Initialize body in case the PR description is empty.
        const body = pr.body || '';

        // Remove all "ignored" portions of the body
        const stripIgnoreTickets = body.replace(STRIP_IGNORE_TICKETS, '');
        const stripIgnoreTicketsLong = stripIgnoreTickets.replace(STRIP_IGNORE_TICKETS_LONG, '');
        const noCommentBody = stripIgnoreTicketsLong.replace(PR_TEMPLATE_COMMENT_REGEX, '');

        const ticketGroups = await ticketFinder({ ...pr, body: noCommentBody });

        return {
          number: pr.number,
          message: body,
          ...ticketGroups,
          title: pr.title,
        };
      }),
    );

    return pullRequestMessages;
  }

  /**
   * async sendMessage - Send slack message to desired channel
   *
   * @param  {Array} blocks  list of blocks to send to a room
   * @param  {String} channel desired channel if it is not what exists in the constructor
   * @param  {Boolean} sendToChannelOnly if you wish to ignore the channelURL (which usually needs a channel) set to true
   *
   * @return {Object} response object from the posted message https://slackapi.github.io/node-slack-sdk/web_api
   */
  async sendMessage(blocks, channel, sendToChannelOnly) {
    const response = await postMessageHandler({
      channel: channel || this.channel,
      blocks,
      channelUrl: sendToChannelOnly ? null : this.channelUrl,
    });

    return response;
  }
}

module.exports = ReleaseCommunication;
