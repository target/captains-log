const { Github } = require('../connectors');

const github = Github();

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
