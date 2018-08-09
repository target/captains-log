const { WebClient } = require('@slack/client');
const config = require('../config');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const { token } = config.get('slack');

const web = new WebClient(token);

module.exports = web;
