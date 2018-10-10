/* eslint max-len: [0, 120] */
const {
  emptyMessages,
  jiraOnlyMessages,
  githubOnlyMessages,
  allMessages,
} = require('../__fixtures__/messagesToFormat');

const format = require('../formatMessages');

describe('format', () => {
  let owner;
  let repo;
  let githubDomain;
  let jiraTeam;

  beforeEach(() => {
    owner = 'tester';
    repo = 'project';
    githubDomain = 'https://github.com';
    jiraTeam = 'FRANK';
  });

  it('should handle empty messages', () => {
    expect(format({
      change: emptyMessages,
      owner,
      repo,
      githubDomain,
      jiraTeam,
    })).toEqual([]);
  });

  it('should handle jira only messages', () => {
    expect(format({
      change: jiraOnlyMessages,
      owner,
      repo,
      githubDomain,
      jiraTeam,
    })).toEqual([
      {
        message: '<https://jira.FRANK.com/browse/CAT-123|[CAT-123]>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: 'CAT-123',
        title: 'fix: The Thing',
      },
      {
        message: '<https://jira.FRANK.com/browse/DOG-345|[DOG-345]>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: 'DOG-345',
        title: 'fix: The Thing',
      },
    ]);
  });

  it('should handle github only messages', () => {
    expect(format({
      change: githubOnlyMessages,
      owner,
      repo,
      githubDomain,
      jiraTeam,
    })).toEqual([
      {
        message: '<https://github.com/example_user/example_project/issues/3|example_user/example_project/#3>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: '3',
        title: 'fix: The Thing',
      },
      {
        message: '<https://github.com/example_user/example_project/issues/4|example_user/example_project/#4>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: '4',
        title: 'fix: The Thing',
      },
    ]);
  });

  it('should handle multiple message types', () => {
    expect(format({
      change: allMessages,
      owner,
      repo,
      githubDomain,
      jiraTeam,
    })).toEqual([
      {
        message: '<https://jira.FRANK.com/browse/CAT-123|[CAT-123]>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: 'CAT-123',
        title: 'fix: The Thing',
      },
      {
        message: '<https://jira.FRANK.com/browse/DOG-345|[DOG-345]>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: 'DOG-345',
        title: 'fix: The Thing',
      },
      {
        message: '<https://github.com/example_user/example_project/issues/3|example_user/example_project/#3>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: '3',
        title: 'fix: The Thing',
      },
      {
        message: '<https://github.com/example_user/example_project/issues/4|example_user/example_project/#4>',
        githubPr: '<https://github.com/tester/project/pull/2|#2>',
        name: '4',
        title: 'fix: The Thing',
      },
    ]);
  });
});
