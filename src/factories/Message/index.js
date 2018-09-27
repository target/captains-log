const generateMessage = require('./generate');
const formatMessage = require('./format');

const Message = function Message(type = 'slack', team = {}) {
  const generate = generateMessage(type, team);
  const format = formatMessage(team);

  return {
    generate,
    format,
  };
};

module.exports = Message;
