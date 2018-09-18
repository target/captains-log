const ticketFinder = require('..');
const { mockBodyWithTickets, mockBodyWithNothing } = require('../__fixtures__/mockBody');

describe('ticketFinder', () => {
  it('should find tickets for all finders given a message body', async () => {
    const tickets = await ticketFinder(mockBodyWithTickets);

    expect(tickets).toEqual({
      jira: ['CAT-123'],
      github: ['123'],
    });
  });

  it('should handle no tickets in a body', async () => {
    const tickets = await ticketFinder(mockBodyWithNothing);

    expect(tickets).toEqual({
      jira: [],
      github: [],
    });
  });
});
