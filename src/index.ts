import App from './App';
import config from './config';
import logger from './logger';

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
