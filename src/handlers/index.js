const getPullRequestHandler = require('./getPullRequestHandler');
const getTagDiffHandler = require('./getTagDiffHandler');
const getTagsHandler = require('./getTagsHandler');
const postMessageHandler = require('./postMessageHandler');
const searchIssuesByCommitHandler = require('./searchIssuesByCommitHandler');

module.exports = {
  getPullRequestHandler,
  getTagDiffHandler,
  getTagsHandler,
  postMessageHandler,
  searchIssuesByCommitHandler,
};
