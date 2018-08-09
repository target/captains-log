const { Github: github } = require('../connectors');

module.exports = async function getPullRequest(owner, repo, number) {
  let pr = {};
  try {
    pr = await github.pullRequests.get({ owner, repo, number });
  } catch (e) {
    throw e;
  }

  return pr.data;
};
