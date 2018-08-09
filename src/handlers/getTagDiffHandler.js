const { Github: github } = require('../connectors');

module.exports = async function getTagDiff(owner, repo, head, base) {
  let tagDiff = {};

  try {
    tagDiff = await github.repos.compareCommits({
      owner,
      repo,
      head,
      base,
    });
  } catch (e) {
    throw e;
  }

  return tagDiff.data;
};
