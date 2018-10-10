const generateSlack = function generateSlack(team, message = '') {
  const {
    color = '#3ef2c5', mentions = '', emoji = '🌱', teamMessages = '', name = 'General', teamTitles = '',
  } = team;
  const teamName = `${name} ${emoji}`;

  if (!teamMessages && !message) return '';

  let fields = [];
  if (teamMessages) {
    fields = [
      {
        title: 'Stories',
        value: teamMessages,
        short: true,
      },
      {
        title: 'Details',
        value: teamTitles,
        short: true,
      },
    ];
  }

  return {
    fallback: teamMessages || message,
    color,
    title: teamName,
    text: mentions,
    fields,
  };
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
