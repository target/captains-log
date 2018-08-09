const IssueTracker = require('./IssueTracker');

const Team = function Team(team = {}) {
  const {
    color = '#3ef2c5', emoji = '🌱', issueTracking = {}, mentions = '', messages = '', name = 'General',
  } = team;

  this.teamMessages = messages;

  const trackers = IssueTracker(issueTracking);

  const messageMatch = (message = '') => {
    let isMatch = false;

    Object.values(trackers).forEach(({ matches = [] }) => {
      isMatch = !!matches.filter(match => message.match(match)).length;
    });

    return isMatch;
  };

  const addMessage = function addMessage(message = '') {
    const msg = `${this.teamMessages.length ? `\n ${message}` : message}`;
    this.teamMessages = this.teamMessages.concat(msg);
    return this.teamMessages;
  };

  return {
    addMessage,
    name,
    color,
    emoji,
    messageMatch,
    mentions,
    teamMessages: this.teamMessages,
    ...trackers,
  };
};

module.exports = Team;
