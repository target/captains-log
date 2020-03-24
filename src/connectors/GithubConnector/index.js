const v3API = require('./GithubConnectorV3');
const v4API = require('./GithubConnectorV4');
const { apiVersion } = require('../../config').get('github');

module.exports = overrideV4 => {
  const isV4 = apiVersion.includes('v4');

  let GithubConnector = v3API;

  if (isV4 || overrideV4) {
    GithubConnector = v4API;
  }

  return GithubConnector;
};
