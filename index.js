const config = require('./src/config');
const logger = require('./src/logger');
const App = require('./src');

const main = async function main() {
  await App(config);
};

main().catch(e => {
  logger.error(e);

  // Always exit 0, we never want to stop execution for this plugin
  process.exit(0);
});

// Just in cases
process.on('unhandledRejection', (reason, p) => {
  logger.error({ message: `Unhandled Rejection at: Promise: ${p}, reason: ${reason}` });
  process.exit(0);
});
