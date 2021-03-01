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
    github_skip_pr_comment,
    github_pr_text,
    github_tag_id,
    github_token,
    slack_channel,
    slack_token,
    slack_url,
    jira_team_domain,
    teams,
    slack_message_heading,
    slack_org_id,
  } = captainsConfig;

  // Github
  nconf.set('github:domain', enterprise_host);
  nconf.set('github:host', github_host);
  nconf.set('github:owner', github_owner);
  nconf.set('github:repo', github_repo);
  nconf.set('github:tagId', github_tag_id);
  nconf.set('github:skip_pr_post', github_skip_pr_comment);
  nconf.set('github:pr_text', github_pr_text);

  if (!github_token)
    throw Error("Captain's log requires a Github Token to run. Please verify you've set one and try again.");
  nconf.set('github:token', github_token);

  // Team Configuration
  nconf.set('teams', teams);

  // Slack
  nconf.set('slack:channel', slack_channel);
  nconf.set('slack:token', slack_token);
  nconf.set('slack:channelUrl', slack_url);
  nconf.set('slack:messageHeading', slack_message_heading);
  nconf.set('slack:orgId', slack_org_id);

  // Jira
  nconf.set('jira:teamDomain', jira_team_domain);
}

module.exports = nconf;
