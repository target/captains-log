const Message = require('..');
const Team = require('../../Team');

describe('Message', () => {
  const defaultTeam = Team({
    name: 'Dunder Mifflin',
    color: '#f06d06',
    emoji: '📄',
    issueTracking: { jira: { teams: ['ACCOUNTING', 'ASSISTANT_TO_THE_REGIONAL_MANAGER'] } },
    mentions: '@Dwight.K.Schrute @Michael.J.Scott @Pam.Beasley',
    messages: 'Where is Michael Scarn!?',
  });

  it('should create a default Message object', () => {
    const message = Message();
    expect(message).toEqual(expect.objectContaining({ generate: expect.any(Function) }));
  });

  it('should generate a slack message for a default group', () => {
    const message = Message();

    expect(message.generate('some message')).toEqual(expect.objectContaining({
      color: expect.any(String),
      fallback: 'some message',
      fields: [],
      text: '',
      title: 'General 🌱',
    }));
  });

  it('should generate a slack message for a team', () => {
    const message = Message('slack', defaultTeam);

    expect(message.generate()).toEqual(expect.objectContaining({
      color: '#f06d06',
      fallback: 'Where is Michael Scarn!?',
      text: defaultTeam.mentions,
      title: 'Dunder Mifflin 📄',
      fields: [
        {
          short: true,
          title: 'Stories',
          value: defaultTeam.teamMessages,
        },
        {
          short: true,
          title: expect.any(String),
          value: expect.any(String),
        },
      ],
    }));
  });
});
