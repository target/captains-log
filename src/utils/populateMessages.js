const populateMessages = function populateMessages(defaultTeam) {
  if (!defaultTeam) throw Error('Must provide default team');

  return function populate(teamsToPopulate = [], messages = [{}]) {
    let filteredMessages = messages;

    if (teamsToPopulate.length === 0) {
      filteredMessages.forEach(message => defaultTeam.addMessage(message));
      return true;
    }

    const [team, ...remainingTeams] = teamsToPopulate;

    filteredMessages = messages.filter(message => {
      if (team.messageMatch(message.url || '')) {
        team.addMessage(message);
      }
      return !team.messageMatch(message.url);
    });

    return populate(remainingTeams, filteredMessages);
  };
};

module.exports = populateMessages;
