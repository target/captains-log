const IssueTracker = require('./IssueTracker');
const { createStorySection } = require('../Blocks/section');

const Team = function Team(team = {}) {
  const {
    color = '#3ef2c5',
    channels = [],
    emoji = '🌱',
    issueTracking = {},
    mentions = '',
    blocks = [],
    name = 'General',
  } = team;
  this.teamMessages = blocks;

  const trackers = IssueTracker(issueTracking);

  const messageMatch = (message = '') => {
    const isMatch = Object.values(trackers).reduce((acc, tracker) => {
      const { matches = [] } = tracker;
      const match = matches.filter(matcher => message.match(matcher));

      if (match.length) {
        return [...acc, ...match];
      }

      return acc;
    }, []);

    return !!isMatch.length;
  };

  const addMessage = function addMessage(message) {
    this.teamMessages = [...this.teamMessages, createStorySection(message)];

    return this.teamMessages;
  };

  return {
    addMessage,
    channels,
    color,
    emoji,
    mentions,
    messageMatch,
    name,
    teamMessages: this.teamMessages,
    ...trackers,
  };
};

module.exports = Team;
