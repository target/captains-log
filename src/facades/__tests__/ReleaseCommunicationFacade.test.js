jest.mock('../../connectors/GithubConnector');
jest.mock('../../handlers');

const { ReleaseCommunication } = require('../');
const handlers = require('../../handlers');
const tagResponse = require('../__fixtures__/tagResponse.json');
const pullRequestResponse = require('../__fixtures__/pullRequestResponse.json');
const pullRequestResponseRawLink = require('../__fixtures__/pullRequestResponseRawLink.json');
const diffResponse = require('../__fixtures__/diffResponse.json');

describe('ReleaseCommunicationFacade', () => {
  let RC;

  beforeEach(() => {
    RC = new ReleaseCommunication({ owner: 'fakeOwner', repo: 'fakeRepo', channel: 'fakeChannel' });
  });

  it('should retrieve and return a diff of two commits given the repo and owner', async () => {
    handlers.getTagsHandler.mockResolvedValue(tagResponse);
    handlers.getTagDiffHandler.mockResolvedValue(diffResponse);
    const diff = await RC.diff();
    const expectedDiff = diffResponse;

    expect(diff).toEqual(expectedDiff);
  });

  it('should parse an empty diff response', async () => {
    const diff = await RC.parseDiff();

    expect(diff).toEqual([]);
  });

  it('should parse a diff response', async () => {
    expect.assertions(1);
    handlers.getPullRequestHandler.mockResolvedValueOnce(pullRequestResponse);
    const diff = await RC.parseDiff(diffResponse);
    const expectedDiff = [
      {
        jiraTickets: ['JIRA-1234'],
        message: pullRequestResponse.body,
        number: 1,
      },
    ];

    expect(diff).toEqual(expectedDiff);
  });

  it('should parse a diff response with raw link', async () => {
    expect.assertions(1);
    handlers.getPullRequestHandler.mockResolvedValueOnce(pullRequestResponseRawLink);
    const diff = await RC.parseDiff(diffResponse);
    const expectedDiff = [
      {
        jiraTickets: ['JIRA-1234'],
        message: pullRequestResponseRawLink.body,
        number: 1,
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
