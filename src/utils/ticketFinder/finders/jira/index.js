const idx = require('idx');
const { uniq } = require('lodash');
const nconf = require('nconf');

const { groupFinder } = require('../../../');

const bodyRegex = nconf.get('regex') || /(?:\[|https:\/\/jira\..*\.com\/browse\/)([[A-Z][A-Z0-9]*-[1-9][0-9]*)\]?/;
const branchRegex = /([[A-Z][A-Z0-9]*-[1-9][0-9]*)\]?/;

const JIRA_REGEX = new RegExp(bodyRegex, 'g');
const JIRA_BRANCH_REGEX = new RegExp(branchRegex, 'g');

const jiraFinder = (pr) => {
  const { body = '' } = pr;

  const jiraTickets = uniq(groupFinder(JIRA_REGEX, body) || []);

  const branchName = idx(pr, _ => _.head.ref);
  const branchTicket = uniq(groupFinder(JIRA_BRANCH_REGEX, branchName) || []);

  const formattedTickets = [...jiraTickets, ...branchTicket].map(ticket => ({
    name: ticket,
  }));

  return {
    tickets: [...formattedTickets],
    name: 'jira',
  };
};

module.exports = jiraFinder;
