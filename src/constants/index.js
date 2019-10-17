/* eslint max-len: [0] */

const { stripIndents } = require('common-tags');

const DEFAULT_HEADING = ( owner, repo,) => 
`🚀 *${owner}/${repo} deployed to production!* Related stories:\n`;

const EMPTY_MESSAGE = (owner, repo) => stripIndents
`🚀 *${owner}/${repo} deployed to production!*\n
  *No stories linked in this release* 🤷‍♀️ \n
`;

const DEFAULT_FOOTER = stripIndents
`_PRs need correct syntax to appear in the list. Problem? Report it <https://github.com/target/captains-log/issues|here>._`;

module.exports = {
  DEFAULT_HEADING,
  EMPTY_MESSAGE,
  DEFAULT_FOOTER,
};
