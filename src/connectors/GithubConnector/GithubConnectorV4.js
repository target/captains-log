const config = require('../../config');

const { domain, v4Host, token } = config.get('github');

const GithubGraphQL = require('@octokit/graphql').defaults({
  baseUrl: `${domain}/api` || v4Host,
  headers: {
    authorization: `bearer ${token}`,
  },
});

module.exports = GithubGraphQL;
