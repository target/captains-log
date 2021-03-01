const { Github } = require('../connectors');
const config = require('../config');

const github = Github();
const enterpriseHost = config.get('github:domain');
const ghUrl = enterpriseHost || 'https://www.github.com';
const customBody = config.get('github:pr_text');

module.exports = async function postReleaseVersionToPR({ owner, repo, number, head }) {
  const url = `${head}](${ghUrl}/${owner}/${repo}/releases/tag/${head}`;
  const userDefinedBody = customBody || '';

  const body = `:rocket:   Posted by [**Captain's Log**](https://target.github.io/captains-log/):

  ${userDefinedBody}

  This pull request was released as a part of [Release: ${url}).
  `;

  let pr = {};

  try {
    pr = await github.issues.createComment({ owner, repo, number, body });
  } catch (e) {
    throw e;
  }

  return pr.data;
};
