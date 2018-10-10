const { uniq } = require('lodash');
const nconf = require('nconf');

const { groupFinder } = require('../../../');

const regex = nconf.get('regex') || /(?:\[|https:\/\/jira\..*\.com\/browse\/)([A-Z0-9]+-[0-9]+)\]?/;
const JIRA_REGEX = new RegExp(regex, 'g');

const jiraFinder = (body) => {
  const jiraTickets = uniq(groupFinder(JIRA_REGEX, body) || []);

  const formattedTickets = jiraTickets.map(ticket => ({
    name: ticket,
  }));

  return {
    tickets: [...formattedTickets],
    name: 'jira',
  };
};

module.exports = jiraFinder;
