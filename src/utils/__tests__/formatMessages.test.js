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
    expect(
      format({
        change: emptyMessages,
        owner,
        repo,
        githubDomain,
        jiraTeam,
      }),
    ).toEqual([]);
  });

  it('should handle jira only messages', () => {
    expect(
      format({
        change: jiraOnlyMessages,
        owner,
        repo,
        githubDomain,
        jiraTeam,
      }),
    ).toEqual([
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            jira: { tickets: [{ name: 'CAT-123' }, { name: 'DOG-345' }] },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: { name: 'CAT-123' },
        },
        name: 'CAT-123',
        title: 'fix: The Thing',
        url: 'https://jira.FRANK.com/browse/CAT-123',
      },
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            jira: { tickets: [{ name: 'CAT-123' }, { name: 'DOG-345' }] },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: { name: 'DOG-345' },
        },
        name: 'DOG-345',
        title: 'fix: The Thing',
        url: 'https://jira.FRANK.com/browse/DOG-345',
      },
    ]);
  });

  it('should handle github only messages', () => {
    expect(
      format({
        change: githubOnlyMessages,
        owner,
        repo,
        githubDomain,
        jiraTeam,
      }),
    ).toEqual([
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            github: {
              tickets: [
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
                  issueNumber: '3',
                  name: '3',
                  project: 'example_user/example_project',
                },
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
                  issueNumber: '4',
                  name: '4',
                  project: 'example_user/example_project',
                },
              ],
            },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: {
            fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
            issueNumber: '3',
            name: '3',
            project: 'example_user/example_project',
          },
        },
        name: '3',
        title: 'fix: The Thing',
        url: 'https://github.com/example_user/example_project/issues/3',
      },
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            github: {
              tickets: [
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
                  issueNumber: '3',
                  name: '3',
                  project: 'example_user/example_project',
                },
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
                  issueNumber: '4',
                  name: '4',
                  project: 'example_user/example_project',
                },
              ],
            },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: {
            fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
            issueNumber: '4',
            name: '4',
            project: 'example_user/example_project',
          },
        },
        name: '4',
        title: 'fix: The Thing',
        url: 'https://github.com/example_user/example_project/issues/4',
      },
    ]);
  });

  it('should handle multiple message types', () => {
    expect(
      format({
        change: allMessages,
        owner,
        repo,
        githubDomain,
        jiraTeam,
      }),
    ).toEqual([
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            github: {
              tickets: [
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
                  issueNumber: '3',
                  name: '3',
                  project: 'example_user/example_project',
                },
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
                  issueNumber: '4',
                  name: '4',
                  project: 'example_user/example_project',
                },
              ],
            },
            jira: { tickets: [{ name: 'CAT-123' }, { name: 'DOG-345' }] },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: { name: 'CAT-123' },
        },
        name: 'CAT-123',
        title: 'fix: The Thing',
        url: 'https://jira.FRANK.com/browse/CAT-123',
      },
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            github: {
              tickets: [
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
                  issueNumber: '3',
                  name: '3',
                  project: 'example_user/example_project',
                },
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
                  issueNumber: '4',
                  name: '4',
                  project: 'example_user/example_project',
                },
              ],
            },
            jira: { tickets: [{ name: 'CAT-123' }, { name: 'DOG-345' }] },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: { name: 'DOG-345' },
        },
        name: 'DOG-345',
        title: 'fix: The Thing',
        url: 'https://jira.FRANK.com/browse/DOG-345',
      },
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            github: {
              tickets: [
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
                  issueNumber: '3',
                  name: '3',
                  project: 'example_user/example_project',
                },
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
                  issueNumber: '4',
                  name: '4',
                  project: 'example_user/example_project',
                },
              ],
            },
            jira: { tickets: [{ name: 'CAT-123' }, { name: 'DOG-345' }] },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: {
            fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
            issueNumber: '3',
            name: '3',
            project: 'example_user/example_project',
          },
        },
        name: '3',
        title: 'fix: The Thing',
        url: 'https://github.com/example_user/example_project/issues/3',
      },
      {
        githubPr: 'https://github.com/tester/project/pull/2',
        meta: {
          change: {
            github: {
              tickets: [
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
                  issueNumber: '3',
                  name: '3',
                  project: 'example_user/example_project',
                },
                {
                  fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
                  issueNumber: '4',
                  name: '4',
                  project: 'example_user/example_project',
                },
              ],
            },
            jira: { tickets: [{ name: 'CAT-123' }, { name: 'DOG-345' }] },
            number: '2',
            title: 'fix: The Thing',
          },
          githubDomain: 'https://github.com',
          jiraTeam: 'FRANK',
          number: '2',
          owner: 'tester',
          repo: 'project',
          ticket: {
            fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
            issueNumber: '4',
            name: '4',
            project: 'example_user/example_project',
          },
        },
        name: '4',
        title: 'fix: The Thing',
        url: 'https://github.com/example_user/example_project/issues/4',
      },
    ]);
  });
});
