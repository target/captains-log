const githubFinder = require('..');

const body = `
close #1
closes #12
closed #13
fix #2
fixes #14
fixed #15
resolve #1
resolves #13
resolved #20
resolves super/duper/#10
resolved super/duper/#11

https://github.com/example_user/example_project/issues/3
https://github.com/example_user/example_project/issues/4
https://git.myenterprise.com/example_user/example_project/issues/5
https://www.github.com/example_user/example_project/issues/6
https://github.com/example_user/example_project/issues/7
https://github.com/example_user/example_project/issues/8
https://github.com/example_user/example_project/issues/9
`;

describe('github finder', () => {
  it('should find all unique ticket types', () => {
    const expectation = {
      tickets: [
        {
          fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
          project: 'example_user/example_project',
          issueNumber: '3',
          name: '3',
        },
        {
          fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
          project: 'example_user/example_project',
          issueNumber: '4',
          name: '4',
        },
        {
          fullLinkedUrl: 'https://git.myenterprise.com/example_user/example_project/issues/5',
          project: 'example_user/example_project',
          issueNumber: '5',
          name: '5',
        },
        {
          fullLinkedUrl: 'https://www.github.com/example_user/example_project/issues/6',
          project: 'example_user/example_project',
          issueNumber: '6',
          name: '6',
        },
        {
          fullLinkedUrl: 'https://github.com/example_user/example_project/issues/7',
          project: 'example_user/example_project',
          issueNumber: '7',
          name: '7',
        },
        {
          fullLinkedUrl: 'https://github.com/example_user/example_project/issues/8',
          project: 'example_user/example_project',
          issueNumber: '8',
          name: '8',
        },
        {
          fullLinkedUrl: 'https://github.com/example_user/example_project/issues/9',
          project: 'example_user/example_project',
          issueNumber: '9',
          name: '9',
        },
        {
          fullLinkedUrl: 'https://github.com/test_owner/test_repo/issues/1',
          project: 'test_owner/test_repo',
          issueNumber: '1',
          name: '1',
        },
        {
          fullLinkedUrl: 'https://github.com/test_owner/test_repo/issues/12',
          project: 'test_owner/test_repo',
          issueNumber: '12',
          name: '12',
        },
        {
          fullLinkedUrl: 'https://github.com/test_owner/test_repo/issues/13',
          project: 'test_owner/test_repo',
          issueNumber: '13',
          name: '13',
        },
        {
          fullLinkedUrl: 'https://github.com/test_owner/test_repo/issues/2',
          project: 'test_owner/test_repo',
          issueNumber: '2',
          name: '2',
        },
        {
          fullLinkedUrl: 'https://github.com/test_owner/test_repo/issues/14',
          project: 'test_owner/test_repo',
          issueNumber: '14',
          name: '14',
        },
        {
          fullLinkedUrl: 'https://github.com/test_owner/test_repo/issues/15',
          project: 'test_owner/test_repo',
          issueNumber: '15',
          name: '15',
        },
        {
          fullLinkedUrl: 'https://github.com/test_owner/test_repo/issues/20',
          project: 'test_owner/test_repo',
          issueNumber: '20',
          name: '20',
        },
        {
          fullLinkedUrl: 'https://github.com/super/duper/issues/10',
          project: 'super/duper',
          issueNumber: '10',
          name: '10',
        },
        {
          fullLinkedUrl: 'https://github.com/super/duper/issues/11',
          project: 'super/duper',
          issueNumber: '11',
          name: '11',
        },
      ],
      name: 'github',
    };
    expect(githubFinder({ body })).toEqual(expectation);
  });

  it('should return no tickets if there are no ticket types', () => {
    const expectation = {
      tickets: [],
      name: 'github',
    };
    expect(githubFinder('')).toEqual(expectation);
  });
});
