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
resolves example_user/example_project/#10
resolved example_user/example_project/#11

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
      tickets: ['3', '4', '5', '6', '7', '8', '9', '1', '12', '13', '2', '14', '15', '20', '10', '11'],
      name: 'github',
    };
    expect(githubFinder(body)).toEqual(expectation);
  });

  it('should return no tickets if there are no ticket types', () => {
    const expectation = {
      tickets: [],
      name: 'github',
    };
    expect(githubFinder('')).toEqual(expectation);
  });
});
