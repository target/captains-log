const IssueTracker = require('./IssueTracker');
const { truncate } = require('../../utils');

const Team = function Team(team = {}) {
  const {
    color = '#3ef2c5',
    emoji = '🌱',
    issueTracking = {},
    mentions = '',
    messages = '',
    titles = '',
    name = 'General',
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

  const addMessage = function addMessage(message = '', title = '', githubPr = '') {
    // Slack lines wrap after ~36 characters. Most formatted messages will
    // include links so we'll say we're wrapping at higher char counts
    const hasMessageWrap = message.length > 90;
    // Titles will have PR Numbers in them, so we'll give them a little less before truncating
    const hasTitleWrap = title.length > 30;

    const formattedTitle = hasTitleWrap ? truncate(title, 55) : title;

    const details = githubPr ? `${githubPr}: ${formattedTitle}` : formattedTitle;

    const hasTeamTitles = !!this.teamTitles.length;
    const hasTeamMessages = !!this.teamMessages.length;

    let messageStories = hasTeamMessages ? `\n ${message}` : message;
    let messageDetails = hasTeamTitles ? `\n ${details}` : details;

    if (hasMessageWrap && !hasTitleWrap) {
      messageStories = `${messageStories}`;
      messageDetails = `${messageDetails} \n `;
    }

    if (!hasMessageWrap && hasTitleWrap) {
      messageStories = `${messageStories} \n `;
      messageDetails = `${messageDetails}`;
    }

    this.teamTitles = this.teamTitles.concat(messageDetails);
    this.teamMessages = this.teamMessages.concat(messageStories);

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
