const findUp = require('find-up');
const { readFileSync } = require('fs');
const { safeLoad } = require('js-yaml');

const initialize = () => {
  let conf = {};

  try {
    const yamlConfig = readFileSync(findUp.sync('.captains.yml'), 'utf8');
    conf = safeLoad(yamlConfig);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Could not find `captains.yml` file, reverting to environment variables');
  }

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
  } = conf;

  const captainsConfig = {
    // Github
    enterprise_host: process.env.PLUGIN_ENTERPRISE_HOST || enterprise_host,
    github_host: process.env.PLUGIN_GITHUB_HOST || github_host,
    github_owner: process.env.PLUGIN_GITHUB_OWNER || github_owner,
    github_repo: process.env.PLUGIN_GITHUB_REPO || github_repo,
    github_tag_id: process.env.PLUGIN_GITHUB_TAG_ID || github_tag_id,
    github_token: process.env.GITHUB_TOKEN || github_token,

    // Team Configuration
    teams: process.env.PLUGIN_TEAMS || teams,

    // Slack
    slack_channel: process.env.PLUGIN_SLACK_CHANNEL || slack_channel,
    slack_token: process.env.SLACK_TOKEN || slack_token,
    slack_url: process.env.SLACK_URL || slack_url,
    slack_message_heading: process.env.PLUGIN_SLACK_MESSAGE_HEADING || slack_message_heading,

    // Jira
    jira_team_domain: process.env.PLUGIN_JIRA_TEAM_DOMAIN || jira_team_domain,
  };

  return captainsConfig;
};

module.exports = initialize;
