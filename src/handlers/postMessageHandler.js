const fetch = require('node-fetch');
const { Slack: slack } = require('../connectors');
const logger = require('../logger');

const postOptions = (blocks, text, channel) => ({
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    blocks,
    channel,
    username: 'Drone',
    text,
    icon_emoji: ':female-pilot:',
  }),
});

module.exports = async function postMessage({ blocks, channel = null, text, channelUrl }) {
  let response = {};

  if (channelUrl) {
    try {
      await fetch(channelUrl, postOptions(blocks, text, channel));
    } catch (e) {
      console.error(`Channel not found at URL: ${channelUrl}`, e);
    }

    return response;
  }

  if (channel) {
    try {
      response = await slack.chat.postMessage({ blocks, channel, text });
    } catch (e) {
      console.error(`Channel "${channel}" not found.`, e);
    }

    return response;
  }

  logger.error('No channel to send message to');
  return response;
};
