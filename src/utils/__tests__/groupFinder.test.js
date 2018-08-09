const groupFinder = require('../groupFinder');

const JIRA_REGEX = new RegExp(/\[([A-Z]+-[0-9]+)\]/, 'g');

describe('groupFinder', () => {
  it('should return the correct group for the regex match', () => {
    const bodyString = 'JIRA [JIRA-123]() ABC-123 [FUN-123]()';
    const groups = groupFinder(JIRA_REGEX, bodyString);
    const expectedGroups = ['JIRA-123', 'FUN-123'];

    expect(groups).toEqual(expectedGroups);
  });
});
