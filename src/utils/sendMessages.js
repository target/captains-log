const { promisify } = require('util');

const sleep = promisify(setTimeout);

/**
 * Slack has a 50 block limit, per message. We need to chunk blocks so we can send them
 * in separate messages if there are more than 50 blocks in a message.
 * More here: https://api.slack.com/reference/block-kit/blocks
 *
 * This function will send out one message per second, until all messages have
 * been sent.
 *
 * @param {Function} sender function that sends a message via slack api
 * @param {Array} blocks Slack "blocks" to send via message
 */
const sendDelayedMessages = async function sendMessages(sender, blocks) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [i, blockChunk] of blocks.entries()) {
    // The slack rate limit for messages is 1 per second, unless it is defined in
    // "special rate limits".
    // eslint-disable-next-line no-await-in-loop
    if (i !== 0) await sleep(1500);
    try {
      sender(blockChunk);
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = { sendDelayedMessages };
