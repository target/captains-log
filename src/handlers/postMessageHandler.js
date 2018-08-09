const fetch = require('node-fetch');
const { Slack: slack } = require('../connectors');
const logger = require('../logger');

const postOptions = (attachments, text, channel) => ({
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    attachments,
    channel,
    username: 'Drone',
    text,
    icon_emoji: ':female-pilot:',
  }),
});

module.exports = async function postMessage({
  attachments, channel, text, channelUrl,
}) {
  let response = {};

  if (channelUrl) {
    try {
      await fetch(channelUrl, postOptions(attachments, text, channel));
    } catch (e) {
      throw e;
    }

    return response;
  }

  if (channel) {
    try {
      response = await slack.chat.postMessage({ attachments, channel, text });
    } catch (e) {
      throw e;
    }

    return response;
  }

  logger.error('No channel to send message to');
  return response;
};
