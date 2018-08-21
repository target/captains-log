const Github = require('@octokit/rest');
const config = require('../config');

const {
  domain, host, timeout, token,
} = config.get('github');

const accepts = [
  'application/vnd.github.v3+json',
  'application/vnd.github.loki-preview+json',
  'application/vnd.github.hellcat-preview+json',
  'application/vnd.github.polaris-preview',
  'application/vnd.github.polaris-preview+json',
  'application/json',
];

const github = new Github({
  timeout,
  headers: {
    accept: accepts.join(','),
    'user-agent': 'octokit/rest v15.8.1',
  },
  baseUrl: `${domain}/api/v3` || host,
});

github.authenticate({
  type: 'token',
  token,
});

module.exports = github;
