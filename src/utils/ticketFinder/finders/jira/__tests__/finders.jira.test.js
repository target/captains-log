const jiraFinder = require('..');

describe('jiraFinder', () => {
  it('should dedupe tickets found in both branches and pr body', () => {
    const pr = {
      body: 'JIRA-123',
      head: {
        ref: 'myname/JIRA-123',
      },
    };

    expect(jiraFinder(pr)).toEqual({
      tickets: [{ name: 'JIRA-123' }],
      name: 'jira',
    });
  });
});
