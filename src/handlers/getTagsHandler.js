const idx = require('idx');

const { Github } = require('../connectors');

const github = Github(true);

module.exports = async function getTags(owner, repo) {
  let repository = [];
  try {
    repository = await github({
      query: `query GetTags($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          refs(
            refPrefix: "refs/tags/"
            first: 100
            orderBy: { field: TAG_COMMIT_DATE, direction: DESC }
          ) {
            edges {
              node {
                name
              }
            }
          }
        }
      }`,
      owner,
      repo,
    });
  } catch (e) {
    throw e;
  }

  const { repository: rep } = repository;
  const response = idx(rep, _ => _.refs.edges) || [];

  // We need to put the tags back into their original format so that we can be backwards compatible with
  // the expected v3 response.
  const tags = response.reduce((acc, edge) => [...acc, { name: idx(edge, _ => _.node.name) || '' }], []);

  return tags;
};
