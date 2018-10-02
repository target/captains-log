const idx = require('idx');

const jiraMessage = ({
  jiraTeam, githubDomain, owner, repo,
}, { name }, number) =>
  `<https://jira.${jiraTeam}.com/browse/${name}|[${name}]> - <${githubDomain}/${owner}/${repo}/pull/${number}|#${number}>`;

const githubMessage = ({ githubDomain, owner, repo }, { fullLinkedUrl, issueNumber, project }, number) =>
  `<${fullLinkedUrl}|${project}/#${issueNumber}> - <${githubDomain}/${owner}/${repo}/pull/${number}|#${number}>`;

/**
 * Map function for issue tracker formatting. Needed to normalize ticket structures for sorting.
 * @param  {Object} ticket issue bucket object. *ticket.project* required
 * @return {Object}        normalized object with message meta
 */
const formatter = (formatArgs, number, title, messageCreator) => ticket => ({
  message: messageCreator(formatArgs, ticket, number),
  name: ticket.name,
  title,
});

/**
 * Format Messages From Issue Tracker Buckets
 * @param {Object} args { change, githubDomain, owner, repo, jiraTeam }
 * @return {Array}      return an array of unsorted and merged messages
 */
const format = (args) => {
  const { change } = args;
  const {
    jira = {}, github = {}, number, title,
  } = change;

  const jiraTickets = idx(jira, _ => _.tickets) || [];
  const githubTickets = idx(github, _ => _.tickets) || [];

  if (!jiraTickets.length && !githubTickets.length) return [];

  return [
    ...jiraTickets.map(formatter(args, number, title, jiraMessage)),
    ...githubTickets.map(formatter(args, number, title, githubMessage)),
  ];
};

module.exports = format;
