const { uniq } = require('lodash');
const nconf = require('nconf');

const { groupFinder } = require('../../../');

const regex = nconf.get('regex') || /(?:\[|https:\/\/jira\..*\.com\/browse\/)([A-Z0-9]+-[0-9]+)\]?/;
const JIRA_REGEX = new RegExp(regex, 'g');

const jiraFinder = body => ({
  tickets: uniq(groupFinder(JIRA_REGEX, body) || []),
  name: 'jira',
});

module.exports = jiraFinder;
