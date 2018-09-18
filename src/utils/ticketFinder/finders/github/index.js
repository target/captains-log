const { uniq } = require('lodash');
const nconf = require('nconf');

const { groupFinder } = require('../../../');

const regex = nconf.get('regex') || /(?:https:\/\/git.*\.com\/.*\/)([0-9]+)?/;
const GITHUB_REGEX = new RegExp(regex, 'g');

const githubFinder = body => ({
  tickets: uniq(groupFinder(GITHUB_REGEX, body) || []),
  name: 'github',
});

module.exports = githubFinder;
