const { populateMessages } = require('..');
const Team = require('../../factories/Team');

describe('populateMessages', () => {
  const messages = [
    {
      message: 'CHANDLER-123: The one with the wedding',
    },
    {
      message: 'JOEY-4345: The one with the duck',
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

    expect(exampleTeam.teamMessages).toEqual(messages[0].message);
  });

  it('should add messages to default team if no team bucket exist', () => {
    populateMessages(defaultTeam)([exampleTeam], messages);

    expect(defaultTeam.teamMessages).toEqual(messages[1].message);
  });
});
