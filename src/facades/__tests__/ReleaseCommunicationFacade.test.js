jest.mock('../../connectors/GithubConnector');
jest.mock('../../handlers');

const { ReleaseCommunication } = require('../');
const handlers = require('../../handlers');
const tagResponse = require('../__fixtures__/tagResponse.json');
const pullRequestResponse = require('../__fixtures__/pullRequestResponse.json');
const pullRequestResponseRawLink = require('../__fixtures__/pullRequestResponseRawLink.json');
const explicitIgnorePRResponse = require('../__fixtures__/explicitIgnore.json');
const squashDiffResponse = require('../__fixtures__/squashDiffResponse.json');
const mergedDiffResponse = require('../__fixtures__/mergeDiffResponse.json');
const searchIssueResponse = require('../__fixtures__/searchIssueResponse.json');

describe('ReleaseCommunicationFacade', () => {
  let RC;

  beforeEach(() => {
    RC = new ReleaseCommunication({ owner: 'fakeOwner', repo: 'fakeRepo', channel: 'fakeChannel' });
  });

  it('should retrieve and return a diff of two commits given the repo and owner', async () => {
    handlers.getTagsHandler.mockResolvedValue(tagResponse);
    handlers.getTagDiffHandler.mockResolvedValue(squashDiffResponse);
    const { diff } = await RC.diff();
    const expectedDiff = squashDiffResponse;

    expect(diff).toEqual(expectedDiff);
  });

  it('should parse an empty diff response', async () => {
    const diff = await RC.parseDiff();

    expect(diff).toEqual([]);
  });

  it('should parse a diff response', async () => {
    expect.assertions(1);
    handlers.getPullRequestHandler.mockResolvedValueOnce(pullRequestResponse);
    const diff = await RC.parseDiff(squashDiffResponse);
    const expectedDiff = [
      {
        github: { name: 'github', tickets: [] },
        jira: { name: 'jira', tickets: [{ name: 'JIRA-1234' }, { name: 'JIRA2-3455' }] },
        message: pullRequestResponse.body,
        number: 1,
        title: 'bla',
      },
    ];

    expect(diff).toEqual(expectedDiff);
  });

  it('should parse a diff response when a pull request has no body', async () => {
    expect.assertions(1);
    handlers.getPullRequestHandler.mockResolvedValueOnce({ ...pullRequestResponse, body: null });
    const diff = await RC.parseDiff(squashDiffResponse);
    const expectedDiff = [
      {
        github: { name: 'github', tickets: [] },
        jira: { name: 'jira', tickets: [] },
        message: '',
        number: 1,
        title: 'bla',
      },
    ];

    expect(diff).toEqual(expectedDiff);
  });

  it('should handle the retrieval and parse of non-squashed commits', async () => {
    expect.assertions(2);
    handlers.getTagsHandler.mockResolvedValue(tagResponse);
    handlers.getTagDiffHandler.mockResolvedValue(mergedDiffResponse);
    handlers.getPullRequestHandler.mockResolvedValueOnce(pullRequestResponse);
    handlers.searchIssuesByCommitHandler.mockResolvedValueOnce(searchIssueResponse);

    const { diff } = await RC.diff();
    const expectedDiff = mergedDiffResponse;

    expect(diff).toEqual(expectedDiff);

    await RC.parseDiff(mergedDiffResponse);

    expect(handlers.getPullRequestHandler).toHaveBeenCalledWith('fakeOwner', 'fakeRepo', 13);
  });

  it('should parse a diff response with raw link', async () => {
    expect.assertions(1);
    handlers.getPullRequestHandler.mockResolvedValueOnce(pullRequestResponseRawLink);
    const diff = await RC.parseDiff(squashDiffResponse);
    const expectedDiff = [
      {
        github: { name: 'github', tickets: [] },
        jira: { name: 'jira', tickets: [{ name: 'JIRA-1234' }, { name: 'JIRA2-3455' }] },
        message: pullRequestResponseRawLink.body,
        number: 1,
        title: 'bla',
      },
    ];

    expect(diff).toEqual(expectedDiff);
  });

  it('should strip out any explicitly ignored tickets', async () => {
    expect.assertions(1);
    handlers.getPullRequestHandler.mockResolvedValueOnce(explicitIgnorePRResponse);
    const diff = await RC.parseDiff(squashDiffResponse);
    const expectedDiff = [
      {
        github: { name: 'github', tickets: [] },
        jira: { name: 'jira', tickets: [{ name: 'JIRA-1234' }] },
        message: explicitIgnorePRResponse.body,
        number: 1,
        title: 'bla',
      },
    ];

    expect(diff).toEqual(expectedDiff);
  });

  // Same async fail 😑
  // it('should parse a diff response with multiple JIRA tickets', async () => {
  //   expect.assertions(1);
  //   handlers.getPullRequestHandler.mockResolvedValueOnce(pullRequestResponse);
  //   const newDiffResponse = { ...diffResponse, body: '[JIRA-12345]() [TEST-0000]()' };
  //
  //   const diff = await RC.parseDiff(newDiffResponse);
  //   const expectedDiff = [
  //     {
  //       jiraTickets: ['JIRA-12345', 'TEST-0000'],
  //       message: pullRequestResponse.body,
  //       number: 1,
  //     },
  //   ];
  //
  //   expect(diff).toEqual(expectedDiff);
  // });

  // Failing because of async, not sure what is going on, will readdress later.
  // it('should parse a diff response without a jira ticket', async () => {
  //   expect.assertions(1);
  //   const newPrBody = { ...pullRequestResponse, body: 'something' };
  //   handlers.githubHandlers.getPullRequest.mockResolvedValueOnce(newPrBody);
  //   const diff = await RC.parseDiff(diffResponse);
  //   const expectedDiff = [
  //     {
  //       jiraTicket: null,
  //       message: newPrBody.body,
  //       number: 1,
  //     },
  //   ];
  //
  //   expect(diff).toEqual(expectedDiff);
  // });
});
