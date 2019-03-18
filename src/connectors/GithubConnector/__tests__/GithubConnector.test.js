const GithubConnector = require('..');

describe('GithubConnector', () => {
  it('should initialize with the v3 api by default', () => {
    const github = GithubConnector();

    expect(Object.getOwnPropertyNames(github)).toMatchInlineSnapshot(`
Array [
  "hook",
  "plugin",
  "request",
  "authenticate",
  "activity",
  "apps",
  "authorization",
  "checks",
  "enterprise",
  "gists",
  "gitdata",
  "integrations",
  "issues",
  "migrations",
  "misc",
  "orgs",
  "projects",
  "pullRequests",
  "reactions",
  "repos",
  "search",
  "users",
  "getFirstPage",
  "getLastPage",
  "getNextPage",
  "getPreviousPage",
  "hasFirstPage",
  "hasLastPage",
  "hasNextPage",
  "hasPreviousPage",
]
`);
  });

  it('should override the initial github v3 service with v4', () => {
    const github = GithubConnector(true);

    expect(github.name).toEqual('newApi');
  });
});
