const Message = require('..');
const { createStorySection } = require('../../Blocks/section');
const Team = require('../../Team');

describe('Message', () => {
  const defaultTeam = Team({
    name: 'Dunder Mifflin',
    color: '#f06d06',
    emoji: '📄',
    issueTracking: { jira: { teams: ['ACCOUNTING', 'ASSISTANT_TO_THE_REGIONAL_MANAGER'] } },
    mentions: '@Dwight.K.Schrute @Michael.J.Scott @Pam.Beasley',
    blocks: [createStorySection('Where is Michael Scarn!?')],
    titles: 'No. NOOOOO.',
  });

  it('should create a default Message object', () => {
    const message = Message();
    expect(message).toEqual(expect.objectContaining({ generate: expect.any(Function) }));
  });

  it('should generate a slack message for a default group', () => {
    const message = Message();

    expect(message.generate('some message')).toEqual(
      [{ "text": { "emoji": true, "text": "🌱 General", "type": "plain_text" }, "type": "header" }, { "text": { "text": " ", "type": "mrkdwn" }, "type": "section" }, { "type": "divider" }],
    );
  });

  it('should generate a slack message for a team', () => {
    const message = Message('slack', defaultTeam);

    expect(message.generate()).toEqual(
      [{ "text": { "emoji": true, "text": "📄 Dunder Mifflin", "type": "plain_text" }, "type": "header" }, { "text": { "text": "📣 @Dwight.K.Schrute @Michael.J.Scott @Pam.Beasley", "type": "mrkdwn" }, "type": "section" }, { "accessory": { "action_id": "overflow-action", "options": [{ "text": { "emoji": true, "text": "💻 View PR: #undefined", "type": "plain_text" }, "url": undefined, "value": "undefined" }, { "text": { "emoji": true, "text": "🎫 See Issue: undefined", "type": "plain_text" }, "url": undefined, "value": "undefined" }], "type": "overflow" }, "text": { "text": "*undefined*: _undefined_", "type": "mrkdwn" }, "type": "section" }, { "type": "divider" }],
    );
  });
});
