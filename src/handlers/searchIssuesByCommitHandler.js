const { Github } = require('../connectors');

const github = Github();

// query is required
module.exports = async function searchIssuesByCommit(query) {
  let issues = {};
  try {
    issues = await github.search.issues({
      q: query,
    });
  } catch (e) {
    throw e;
  }

  return issues.data;
};
