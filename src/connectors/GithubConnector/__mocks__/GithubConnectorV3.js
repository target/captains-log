module.exports = {
  authenticate: () => ({
    pullRequests: jest.fn(() => ({ get: jest.fn() })),
    repos: jest.fn(() => ({ getTags: jest.fn(), compareCommits: jest.fn() })),
  }),
};
