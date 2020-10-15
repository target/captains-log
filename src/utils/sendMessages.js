const sleep = require('util').promisify(setTimeout);

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
  debugger;
  await Promise.all(
    blocks.map(async (blockChunk, i) => {
      // The slack rate limit for messages is 1 per second, unless it is defined in
      // "special rate limites".
      if (i !== 0) await sleep(1500);
      try {
        sender(blockChunk);
      } catch (error) {
        console.log(error);
      }
    }),
  );
};

module.exports = { sendDelayedMessages };
