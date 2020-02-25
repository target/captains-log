/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const packageJSON = require('../package.json');
const { initialize } = require('./utils');

/**
 * Prepare environment configuration
 */
const DEVELOPMENT = 'development';
process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

/**
 * Expand configuration file paths
 */
const defaultConfigPath = path.resolve(__dirname, '../config', 'default.json');
const envConfigPath = path.resolve(__dirname, '../config', `${process.env.NODE_ENV}.json`);

/**
 * Instantiate nconf configuration object from numerous sources (e.g.
 *  ARGV, ENV, [environment].json, and default.json).
 *  Configuration options are set based on declaration precedence, with
 *  ARGV being highest precedence and default.json being the lowest precedence.
 */
nconf
  .argv()
  .env()
  .file({
    file: envConfigPath,
  })
  .defaults({
    store: JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8')),
  });

// Declare package.json config on application config object
nconf.set('name', packageJSON.name);

// Determine server port by variable precedence
process.env.PORT = process.env.PORT || nconf.get('PORT') || '3000';

// Ensure PORT is added to the config object
nconf.set('PORT', process.env.PORT);

// Set development flag
nconf.set('development', process.env.NODE_ENV === DEVELOPMENT);

// PR RegExp
nconf.set('regexp', process.env.PLUGIN_REGEXP);

if (process.env.NODE_ENV !== 'test') {
  // Github
  nconf.set('github:domain', process.env.PLUGIN_ENTERPRISE_HOST);
  nconf.set('github:host', process.env.PLUGIN_GITHUB_HOST);
  nconf.set('github:owner', process.env.PLUGIN_GITHUB_OWNER);
  nconf.set('github:repo', process.env.PLUGIN_GITHUB_REPO);
  nconf.set('github:tagId', process.env.PLUGIN_GITHUB_TAG_ID);
  nconf.set('github:token', process.env.GITHUB_TOKEN);

  // Team Configuration
  nconf.set('teams', process.env.PLUGIN_TEAMS);

  // Slack
  nconf.set('slack:channel', process.env.PLUGIN_SLACK_CHANNEL);
  nconf.set('slack:token', process.env.SLACK_TOKEN);
  nconf.set('slack:channelUrl', process.env.SLACK_URL);
  nconf.set('slack:messageHeading', process.env.PLUGIN_SLACK_MESSAGE_HEADING);

  // Jira
  nconf.set('jira:teamDomain', process.env.PLUGIN_JIRA_TEAM_DOMAIN);

  // Initialize captains.yml
  initialize(nconf);
}

module.exports = nconf;
