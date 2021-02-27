const { Github } = require('../connectors');
const config = require('../config');

const github = Github();
const enterpriseHost = config.get('github:domain');
const ghUrl = enterpriseHost || 'https://www.github.com';

module.exports = async function postReleaseVersionToPR({ owner, repo, number, head }) {
  const body = `:rocket:   Posted by [**Captain's Log**](https://target.github.io/captains-log/#/):

  This pull request was released as a part of [Release: ${head}](${ghUrl}/${owner}/${repo}/releases/tag/${head}).
  `;

  let pr = {};

  try {
    pr = await github.issues.createComment({ owner, repo, number, body });
  } catch (e) {
    throw e;
  }

  return pr.data;
};
