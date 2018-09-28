const { uniq } = require('lodash');

const { groupFinder } = require('../../../');

const GITHUB_QUALIFIED_URL = /https:\/\/.*\..+\/(\d+)/;
const CLOSE_ISSUE_SYNTAX = /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s(?:\S.*\/\S.*#|#)(\d+)/;

const GITHUB_URL_REGEX = new RegExp(GITHUB_QUALIFIED_URL, 'gm');
const GITHUB_CLOSE_REGEX = new RegExp(CLOSE_ISSUE_SYNTAX, 'gm');

const githubFinder = body => ({
  tickets: [...uniq(groupFinder(GITHUB_URL_REGEX, body) || []), ...uniq(groupFinder(GITHUB_CLOSE_REGEX, body) || [])],
  name: 'github',
});

module.exports = githubFinder;
