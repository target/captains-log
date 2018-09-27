const formatJira = (message, team) => {};

const formatGithub = (message, team) => {};

const format = team => (message, type) => {
  switch (type) {
    case 'jira':
      return formatJira(message, team);
    case 'github':
      return formatGithub(message, team);
    default:
      return { message: '', attachments: [] };
  }
};

module.exports = format;
