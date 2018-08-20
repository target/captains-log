const Team = require('..');

describe('Team', () => {
  const exampleTeam = {
    color: 'blue',
    emoji: '🤷‍♀️',
    mentions: '@MillhouseManaStorm',
    name: 'FRIENDS',
    issueTracking: {
      jira: {
        projects: ['CHANDLER', 'MONICA'],
      },
    },
  };

  it('should create a default team', () => {
    const team = Team();

    expect(team).toEqual(expect.objectContaining({
      color: expect.any(String),
      emoji: expect.any(String),
      mentions: expect.any(String),
      name: expect.any(String),
      messageMatch: expect.any(Function),
    }));
  });

  it('should create an example team', () => {
    const team = Team(exampleTeam);

    expect(team).toEqual(expect.objectContaining({
      color: 'blue',
      emoji: '🤷‍♀️',
      jira: { matches: ['CHANDLER', 'MONICA'] },
      mentions: '@MillhouseManaStorm',
      messageMatch: expect.any(Function),
      name: 'FRIENDS',
    }));
  });

  it('should match on a message mentioning a team', () => {
    const team = Team(exampleTeam);

    expect(team.messageMatch('CHANDLER')).toEqual(true);
  });

  it('should not match on a message not mentioning a team', () => {
    const team = Team(exampleTeam);

    expect(team.messageMatch('JOEY')).toEqual(false);
  });

  it('should add a message to existing messages', () => {
    const team = Team({ ...exampleTeam, messages: 'Hi' });

    expect(team.teamMessages).toEqual('Hi');

    team.addMessage('Bye');

    expect(team.teamMessages).toEqual('Hi\n Bye');
  });

  it('should add a title to existing titles', () => {
    const team = Team({ ...exampleTeam, titles: 'This Is A Title' });

    expect(team.teamTitles).toEqual('This Is A Title');

    team.addMessage('', 'Bye');

    expect(team.teamTitles).toEqual('This Is A Title\n Bye');
  });
});
