const createTeamHeader = function createTeamHeader(teamName) {
  return {
    type: 'header',
    text: {
      type: 'plain_text',
      text: teamName,
      emoji: true,
    }
  }
};

module.exports = {
  createTeamHeader,
};