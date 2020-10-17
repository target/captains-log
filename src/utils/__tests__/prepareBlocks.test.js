const createBlocks = require('../prepareBlocks');
const Team = require('../../factories/Team');
const { createStorySection } = require('../../factories/Blocks/section');

const fakeConfig = {
  get: jest.fn(),
};

const defaultTeam = Team();

describe('createBlocks', () => {
  it('should return a default message when there are no messages sent', () => {
    expect(createBlocks(false, { config: fakeConfig }).preparedBlocks[0][0].type).toEqual('section');
  });

  it('should return a single array if messages do not exceed 50', () => {
    const exampleTeam = Team({
      color: 'blue',
      emoji: '🤷‍♀️',
      mentions: '@MillhouseManaStorm',
      name: 'FRIENDS',
      blocks: Array(5).fill([createStorySection('hi')]),
      issueTracking: {
        jira: {
          projects: ['CHANDLER', 'MONICA'],
        },
      },
    });
    expect(
      createBlocks(true, {
        config: fakeConfig,
        owner: 'you',
        repo: 'me',
        teamList: [exampleTeam],
        head: 'sweet',
        base: 'dude',
        defaultTeam,
      }).preparedBlocks,
    ).toHaveLength(1);
  });

  it('should return a multiple arrays if messages do exceed 50', () => {
    const exampleTeam = Team({
      color: 'blue',
      emoji: '🤷‍♀️',
      mentions: '@MillhouseManaStorm',
      name: 'FRIENDS',
      blocks: Array(105).fill([createStorySection('hi')]),
      issueTracking: {
        jira: {
          projects: ['CHANDLER', 'MONICA'],
        },
      },
    });
    expect(
      createBlocks(true, {
        config: fakeConfig,
        owner: 'you',
        repo: 'me',
        teamList: [exampleTeam],
        head: 'sweet',
        base: 'dude',
        defaultTeam,
      }).preparedBlocks,
    ).toHaveLength(3);
  });
});
