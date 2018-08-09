const IssueTracker = require('../IssueTracker');

describe('IssueTracker', () => {
  it('should create a default issue tracker object', () => {
    const trackers = IssueTracker();

    expect(trackers).toEqual({});
  });

  it('should create a jira tracker', () => {
    const trackers = IssueTracker({ jira: { projects: ['AWESOME'] } });

    expect(trackers).toEqual({ jira: { matches: ['AWESOME'] } });
  });
});
