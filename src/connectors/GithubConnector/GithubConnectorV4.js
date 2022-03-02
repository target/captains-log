const { graphql } = require('@octokit/graphql');
const config = require('../../config');

// https://github.com/semantic-release/github/issues/268#issuecomment-628829510
const { domain, token } = config.get('github');

const baseUrl = domain ? { baseUrl: `${domain}/api` } : {};
console.log({ baseUrl1: baseUrl, token });

const GithubGraphQL = graphql.defaults({
  ...baseUrl,
  headers: {
    authorization: `token ${token}`,
  },
});

module.exports = GithubGraphQL;
