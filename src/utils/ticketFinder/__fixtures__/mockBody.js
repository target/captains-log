const mockBodyWithTickets = `
  This is a body with tickets from:

  JIRA
  ===
  https://jira.fun.com/browse/CAT-123

  GITHUB
  ===

  https://github.com/owner/repo/issues/123
`;

const mockBodyWithTicketsInBrackets = `
  This is a body with tickets from:

  JIRA
  ===
  [CAT-123]

  GITHUB
  ===

  https://github.com/owner/repo/issues/123
`;

const mockBodyWithTicketLikeThings = `
  This is a body with:

  [2018-10]
  [0CAT-123]
  [CAT-01]
`;

const mockBodyWithMultipleTickets = `
  This is a body with tickets from:

  JIRA
  ===
  https://jira.fun.com/browse/CAT-123
  https://jira.fun.com/browse/CAT-345

  GITHUB
  ===

  https://github.com/owner/repo/issues/123
  https://github.com/owner/repo/issues/546
`;

const mockBodyWithNothing = '';

module.exports = {
  mockBodyWithTickets,
  mockBodyWithTicketsInBrackets,
  mockBodyWithTicketLikeThings,
  mockBodyWithMultipleTickets,
  mockBodyWithNothing,
};
