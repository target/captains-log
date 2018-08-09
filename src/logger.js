const pino = require('pino');

const config = require('./config');

const logs = config.get('logs');
const { level, messageKey, prettyPrint } = logs;

module.exports = pino({ level, messageKey, prettyPrint });
