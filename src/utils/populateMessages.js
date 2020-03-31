const populateMessages = function populateMessages(defaultTeam) {
  if (!defaultTeam) throw Error('Must provide default team');

  return function populate(teamsToPopulate = [], messages = [{}]) {
    let filteredMessages = messages;

    if (teamsToPopulate.length === 0) {
      filteredMessages.forEach(({ message = '', title = '', githubPr = '' }) =>
        defaultTeam.addMessage(message, title, githubPr),
      );
      return true;
    }

    const [team, ...remainingTeams] = teamsToPopulate;

    filteredMessages = messages.filter(({ message = '', title = '', githubPr = '' }) => {
      if (team.messageMatch(message)) {
        team.addMessage(message, title, githubPr);
      }
      return !team.messageMatch(message);
    });

    return populate(remainingTeams, filteredMessages);
  };
};

module.exports = populateMessages;
