const { createTeamHeader } = require('../Blocks/header');
const { createDivider } = require('../Blocks/divider');
const { createMentions } = require('../Blocks/section');

const generateSlack = function generateSlack(team, message = '') {
  const { mentions = '', emoji = '🌱', teamMessages = [], name = 'General' } = team;
  const teamName = `${emoji} ${name}`;

  if (!teamMessages.length && !message) return '';

  return [createTeamHeader(teamName), createMentions(mentions), ...teamMessages, createDivider()];
};

const generate = (type, team) => (message = '') => {
  switch (type) {
    case 'slack':
      return generateSlack(team, message);
    default:
      return '';
  }
};

module.exports = generate;
