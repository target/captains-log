const { Github: github } = require('../connectors');
const logger = require('../logger');

module.exports = async function getTags(owner, repo) {
  let tags = [];
  try {
    tags = await github.repos.getTags({ owner, repo });
  } catch (e) {
    throw e;
  }

  return tags.data;
};
