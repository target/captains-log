const ticketFinder = require('..');
const {
  mockBodyWithTickets,
  mockBodyWithTicketsInBrackets,
  mockBodyWithTicketLikeThings,
  mockBodyWithMultipleTickets,
  mockBodyWithNothing,
} = require('../__fixtures__/mockBody');

describe('ticketFinder', () => {
  it('should find tickets for all finders given a message body', async () => {
    const tickets = await ticketFinder({ body: mockBodyWithTickets });

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

  it('should find Jira tickets in brackets in given a message body', async () => {
    const tickets = await ticketFinder({ body: mockBodyWithTicketsInBrackets });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [{ name: 'CAT-123' }] },
    });
  });

  it('should find Jira ticket when there are tickets in the body and in the branch name', async () => {
    const tickets = await ticketFinder({ body: mockBodyWithTicketsInBrackets, head: { ref: 'JIRA-123' } });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [{ name: 'CAT-123' }, { name: 'JIRA-123' }] },
    });
  });

  it('should find Jira ticket when there are tickets in the branch name only', async () => {
    // ticket id only
    let tickets = await ticketFinder({ body: mockBodyWithNothing, head: { ref: 'JIRA-123' } });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [{ name: 'JIRA-123' }] },
    });

    // ticket at beginning
    tickets = await ticketFinder({ body: mockBodyWithNothing, head: { ref: 'MANGO-123/therynamos-great-branch' } });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [{ name: 'MANGO-123' }] },
    });

    // ticket at end
    tickets = await ticketFinder({ body: mockBodyWithNothing, head: { ref: 'therynamo/JAVA-123' } });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [{ name: 'JAVA-123' }] },
    });
  });

  it('should not find Jira ticket when there are tickets in the branch name only, but formatted incorrectly', async () => {
    // ticket id only
    let tickets = await ticketFinder({ body: mockBodyWithNothing, head: { ref: 'JIRa-123' } });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [] },
    });

    // ticket at beginning
    tickets = await ticketFinder({ body: mockBodyWithNothing, head: { ref: '[MANG-ABC]/therynamos-great-branch' } });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [] },
    });

    // ticket at end
    tickets = await ticketFinder({ body: mockBodyWithNothing, head: { ref: 'therynamo/JIRA123' } });

    expect(tickets).toEqual({
      github: { name: 'github', tickets: [] },
      jira: { name: 'jira', tickets: [] },
    });
  });

  it('should not find things that look almost like tickets in given a message body', async () => {
    const tickets = await ticketFinder({ body: mockBodyWithTicketLikeThings });

    expect(tickets).toEqual({ github: { name: 'github', tickets: [] }, jira: { name: 'jira', tickets: [] } });
  });

  it('should find multiple tickets for all finders given a message body', async () => {
    const tickets = await ticketFinder({ body: mockBodyWithMultipleTickets });

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
    const tickets = await ticketFinder({ body: mockBodyWithNothing });

    expect(tickets).toEqual({ github: { name: 'github', tickets: [] }, jira: { name: 'jira', tickets: [] } });
  });
});
