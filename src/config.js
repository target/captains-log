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
  // Initialize captains.yml
  const captainsConfig = initialize() || {};
  const {
    enterprise_host,
    github_host,
    github_owner,
    github_repo,
    github_tag_id,
    github_token,
    slack_channel,
    slack_token,
    slack_url,
    jira_team_domain,
    teams,
    slack_message_heading,
  } = captainsConfig;

  // Github
  nconf.set('github:domain', process.env.PLUGIN_ENTERPRISE_HOST || enterprise_host);
  nconf.set('github:host', process.env.PLUGIN_GITHUB_HOST || github_host);
  nconf.set('github:owner', process.env.PLUGIN_GITHUB_OWNER || github_owner);
  nconf.set('github:repo', process.env.PLUGIN_GITHUB_REPO || github_repo);
  nconf.set('github:tagId', process.env.PLUGIN_GITHUB_TAG_ID || github_tag_id);

  if (!process.env.GITHUB_TOKEN && !github_token)
    throw Error("Captain's log requires a Github Token to run. Please verify you've set one and try again.");
  nconf.set('github:token', process.env.GITHUB_TOKEN || github_token);

  // Team Configuration
  nconf.set('teams', process.env.PLUGIN_TEAMS || teams);

  // Slack
  nconf.set('slack:channel', process.env.PLUGIN_SLACK_CHANNEL || slack_channel);
  nconf.set('slack:token', process.env.SLACK_TOKEN || slack_token);
  nconf.set('slack:channelUrl', process.env.SLACK_URL || slack_url);
  nconf.set('slack:messageHeading', process.env.PLUGIN_SLACK_MESSAGE_HEADING || slack_message_heading);

  // Jira
  nconf.set('jira:teamDomain', process.env.PLUGIN_JIRA_TEAM_DOMAIN || jira_team_domain);
}

module.exports = nconf;
