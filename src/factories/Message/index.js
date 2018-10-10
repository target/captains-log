const generateMessage = require('./generate');

const Message = function Message(type = 'slack', team = {}) {
  const generate = generateMessage(type, team);

  return {
    generate,
  };
};

module.exports = Message;
