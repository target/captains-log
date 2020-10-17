const { populateMessages } = require('..');
const { createStorySection } = require('../../factories/Blocks/section');

const Team = require('../../factories/Team');

describe('populateMessages', () => {
  const messages = [
    {
      message: 'CHANDLER-123: The one with the wedding',
      title: 'bugfix: find missing Chandler',
      url: 'https://jira.you.com/browse/CHANDLER-123'
    },
    {
      message: 'JOEY-4345: The one with the duck',
      title: 'ducks!!!',
      url: 'https://jira.you.com/browse/JOEY-4345'
    },
  ];

  let exampleTeam;
  let defaultTeam;

  beforeEach(() => {
    defaultTeam = Team();
    exampleTeam = Team({
      color: 'blue',
      emoji: '🤷‍♀️',
      mentions: '@MillhouseManaStorm',
      name: 'FRIENDS',
      issueTracking: {
        jira: {
          projects: ['CHANDLER', 'MONICA'],
        },
      },
    });
  });

  it('should require a default team', () => {
    expect(() => populateMessages()()).toThrowError(/^Must provide default team$/);
  });

  it('should allow for no teams or messages to be passed', () => {
    expect(() => populateMessages(defaultTeam)()).not.toThrow();
  });

  it('should assign team messages if given teams and relevant team messages', () => {
    populateMessages(defaultTeam)([exampleTeam], messages);

    expect(exampleTeam.teamMessages).toEqual([createStorySection(messages[0])]);
  });


});
