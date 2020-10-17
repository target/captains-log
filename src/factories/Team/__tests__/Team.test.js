const { createStorySection } = require('../../Blocks/section');
/* eslint max-len: [0, 120] */
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

    expect(team).toEqual(
      expect.objectContaining({
        channels: [],
        color: expect.any(String),
        emoji: expect.any(String),
        mentions: expect.any(String),
        name: expect.any(String),
        messageMatch: expect.any(Function),
      }),
    );
  });

  it('should create an example team', () => {
    const team = Team(exampleTeam);

    expect(team).toEqual(
      expect.objectContaining({
        color: 'blue',
        emoji: '🤷‍♀️',
        jira: { matches: ['CHANDLER', 'MONICA'] },
        mentions: '@MillhouseManaStorm',
        messageMatch: expect.any(Function),
        name: 'FRIENDS',
      }),
    );
  });

  it('should match on a message mentioning a team', () => {
    const team = Team(exampleTeam);

    expect(team.messageMatch('CHANDLER')).toEqual(true);
  });

  it('should match on a github message mentioning a team', () => {
    const team = Team({ ...exampleTeam, issueTracking: { github: { projects: ['my_owner/my_repo'] } } });

    expect(
      team.messageMatch(
        '<https://github.com/my_owner/my_repo/issues/3|example_user/example_project/#3> - <https://github.com/tester/project/pull/2|#2',
      ),
    ).toEqual(true);
  });

  it('should match on a message mentioning a team with multiple issue trackers', () => {
    const team = Team({
      ...exampleTeam,
      issueTracking: { github: { projects: ['my_owner/my_repo'] } },
      jira: { projects: ['TEST'] },
    });

    expect(
      team.messageMatch(
        '<https://github.com/my_owner/my_repo/issues/3|example_user/example_project/#3> - <https://github.com/tester/project/pull/2|#2',
      ),
    ).toEqual(true);
  });

  it('should not match on a github message not mentioning a team', () => {
    const team = Team({ ...exampleTeam, issueTracking: { github: { projects: ['my_owner/my_repo'] } } });

    expect(
      team.messageMatch(
        '<https://github.com/test/project/issues/3|example_user/example_project/#3> - <https://github.com/my_owner/my_repo/pull/2|#2',
      ),
    ).toEqual(false);
  });

  it('should not match on a message not mentioning a team', () => {
    const team = Team(exampleTeam);

    expect(team.messageMatch('JOEY')).toEqual(false);
  });

  it('should add a message to existing messages', () => {
    const team = Team({ ...exampleTeam, blocks: [{ msg: 'Hi' }] });

    expect(team.teamMessages).toEqual([{ msg: 'Hi' }]);

    team.addMessage('Bye');

    expect(team.teamMessages).toEqual([{ msg: 'Hi' }, createStorySection('Bye')]);
  });

});
