const IssueTracker = require('./IssueTracker');
const { truncate } = require('../../utils');

const Team = function Team(team = {}) {
  const {
    color = '#3ef2c5', emoji = '🌱', issueTracking = {}, mentions = '', messages = '', titles = '', name = 'General',
  } = team;
  this.teamTitles = titles;
  this.teamMessages = messages;

  const trackers = IssueTracker(issueTracking);

  const messageMatch = (message = '') => {
    let isMatch = false;

    Object.values(trackers).forEach(({ matches = [] }) => {
      isMatch = !!matches.filter(match => message.match(match)).length;
    });

    return isMatch;
  };

  const addMessage = function addMessage(message = '', title = '') {
    const msg = `${this.teamMessages.length ? `\n ${message}` : message}`;
    const t = `${this.teamTitles.length ? `\n ${truncate(title)}` : truncate(title)}`;
    this.teamTitles = this.teamTitles.concat(t);
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
    teamTitles: this.teamTitles,
    ...trackers,
  };
};

module.exports = Team;
