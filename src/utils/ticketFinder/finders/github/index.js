const { uniq } = require('lodash');

const config = require('../../../../config');
const { groupFinder } = require('../../../');

const githubDomain = config.get('github:domain') || 'https://github.com';
const owner = config.get('github:owner');
const repo = config.get('github:repo');

const GITHUB_QUALIFIED_URL = /(https:\/\/(?:www.git|git)[^\s]*(\.[^\s]+)+\/[^\s]+\/[^\s]+\/issues\/\d+)/;
const GITHUB_QUALIFIED_NUMBER_URL = /https:\/\/(?:www.git|git).*\..+\/(\d+)/;
const CLOSE_ISSUE_SYNTAX = /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s(\S.*\/\S.*#\d+|#\d+)/;
const CLOSE_SYNTAX_NUMBER = /#(\d+)/;
const CLOSE_SYNTAX_PROJECT = /(.+)\/#\d+/;
const OWNER_PROJECT = /https:\/\/(?:www.git|git).*\.com\/(.+)?\/.+\/\d+$/;

const GITHUB_URL_REGEX = new RegExp(GITHUB_QUALIFIED_URL, 'gm');
const GITHUB_URL_NUMBER_REGEX = new RegExp(GITHUB_QUALIFIED_NUMBER_URL, 'gm');
const GITHUB_PROJECT_REGEX = new RegExp(OWNER_PROJECT, 'gm');
const GITHUB_CLOSE_REGEX = new RegExp(CLOSE_ISSUE_SYNTAX, 'gmi');
const GITHUB_CLOSE_NUMBER_REGEX = new RegExp(CLOSE_SYNTAX_NUMBER, 'gm');
const GITHUB_CLOSE_PROJECT_REGEX = new RegExp(CLOSE_SYNTAX_PROJECT, 'gm');

const githubFinder = pr => {
  const { body = '' } = pr;

  const fullUrls = uniq(groupFinder(GITHUB_URL_REGEX, body) || []);
  const closeSyntaxUrls = uniq(groupFinder(GITHUB_CLOSE_REGEX, body) || []);

  const formattedUrlTickets = fullUrls.map(url => ({
    fullLinkedUrl: url,
    project: uniq(groupFinder(GITHUB_PROJECT_REGEX, url) || [])[0],
    issueNumber: uniq(groupFinder(GITHUB_URL_NUMBER_REGEX, url) || [])[0],
    name: uniq(groupFinder(GITHUB_URL_NUMBER_REGEX, url) || [])[0],
  }));

  const formattedCloseTickets = closeSyntaxUrls.map(closer => {
    const issueNumber = uniq(groupFinder(GITHUB_CLOSE_NUMBER_REGEX, closer) || [])[0];
    const project = uniq(groupFinder(GITHUB_CLOSE_PROJECT_REGEX, closer) || [])[0] || `${owner}/${repo}`;

    return {
      fullLinkedUrl: `${githubDomain}/${project}/issues/${issueNumber}`,
      project,
      issueNumber,
      name: issueNumber,
    };
  });

  return {
    tickets: [...formattedUrlTickets, ...formattedCloseTickets],
    name: 'github',
  };
};

module.exports = githubFinder;
