const ticketFinder = require('..');
const { mockBodyWithTickets, mockBodyWithNothing, mockBodyWithMultipleTickets } = require('../__fixtures__/mockBody');

describe('ticketFinder', () => {
  it('should find tickets for all finders given a message body', async () => {
    const tickets = await ticketFinder(mockBodyWithTickets);

    expect(tickets).toEqual({
      github: {
        name: 'github',
        tickets: [
          {
            fullLinkedUrl: 'https://github.com/owner/repo/issues/123',
            issueNumber: '123',
            name: '123',
            project: 'owner/repo',
          },
        ],
      },
      jira: { name: 'jira', tickets: [{ name: 'CAT-123' }] },
    });
  });

  it('should find multiple tickets for all finders given a message body', async () => {
    const tickets = await ticketFinder(mockBodyWithMultipleTickets);

    expect(tickets).toEqual({
      github: {
        name: 'github',
        tickets: [
          {
            fullLinkedUrl: 'https://github.com/owner/repo/issues/123',
            issueNumber: '123',
            project: 'owner/repo',
            name: '123',
          },
          {
            fullLinkedUrl: 'https://github.com/owner/repo/issues/546',
            issueNumber: '546',
            project: 'owner/repo',
            name: '546',
          },
        ],
      },
      jira: { name: 'jira', tickets: [{ name: 'CAT-123' }, { name: 'CAT-345' }] },
    });
  });

  it('should handle no tickets in a body', async () => {
    const tickets = await ticketFinder(mockBodyWithNothing);

    expect(tickets).toEqual({ github: { name: 'github', tickets: [] }, jira: { name: 'jira', tickets: [] } });
  });
});
