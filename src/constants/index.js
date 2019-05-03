/* eslint max-len: [0] */

const { stripIndents } = require('common-tags');

const DEFAULT_HEADING = (
  owner,
  repo,
) => `🚀 *${owner}/${repo} deployed to production!* Related stories:\n _PRs need correct syntax to appear in the list. Problem? Please report it <https://github.com/target/captains-log/issues|here>._
`;

const EMPTY_MESSAGE = (owner, repo) => stripIndents`\n
  *No stories linked in this release for ${owner}/${repo}.* 🤷‍♀️ \n

_Think something is broken? Report it <https://github.com/target/captains-log/issues|here>._
`;

module.exports = {
  DEFAULT_HEADING,
  EMPTY_MESSAGE,
};
