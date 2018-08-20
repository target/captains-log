const Message = function Message(type = 'slack', team = {}) {
  const {
    color = '#3ef2c5', mentions = '', emoji = '🌱', teamMessages = '', name = 'General', teamTitles = '',
  } = team;
  const teamName = `${name} ${emoji}`;

  const generateSlack = function generateSlack(message = '') {
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

  const generate = function generate(message = '') {
    switch (type) {
      case 'slack':
        return generateSlack(message);
      default:
        return '';
    }
  };

  return {
    generate,
  };
};

module.exports = Message;
