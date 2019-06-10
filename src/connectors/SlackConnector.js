const { WebClient } = require('@slack/web-api');
const config = require('../config');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const { token } = config.get('slack');

const web = new WebClient(token);

module.exports = web;
