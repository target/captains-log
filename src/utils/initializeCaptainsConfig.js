const findUp = require('find-up');
const { readFileSync } = require('fs');
const { safeLoad } = require('js-yaml');

const getEnvVar = value => {
  const formattedValue = value.toUpperCase();

  if (process.env[formattedValue]) {
    return process.env[formattedValue];
  }

  if (process.env[`PLUGIN_${formattedValue}`]) {
    return process.env[`PLUGIN_${formattedValue}`];
  }

  if (process.env[`PARAMETER_${formattedValue}`]) {
    return process.env[`PARAMETER_${formattedValue}`];
  }
};

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
    github_skip_pr_comment,
    github_pr_text,
    slack_channel,
    slack_token,
    slack_url,
    jira_team_domain,
    teams,
    slack_message_heading,
    slack_org_id,
  } = conf;

  const captainsConfig = {
    // Github
    enterprise_host: getEnvVar('ENTERPRISE_HOST') || enterprise_host,
    github_host: getEnvVar('GITHUB_HOST') || github_host,
    github_owner: getEnvVar('GITHUB_OWNER') || github_owner,
    github_repo: getEnvVar('GITHUB_REPO') || github_repo,
    github_tag_id: getEnvVar('GITHUB_TAG_ID') || github_tag_id,
    github_token: getEnvVar('GITHUB_TOKEN') || github_token,
    github_skip_pr_comment: getEnvVar('GITHUB_SKIP_PR_COMMENT') || github_skip_pr_comment,
    github_pr_text: getEnvVar('GITHUB_PR_TEXT') || github_pr_text,

    // Team Configuration
    teams: getEnvVar('TEAMS') || teams,

    // Slack
    slack_channel: getEnvVar('SLACK_CHANNEL') || slack_channel,
    slack_token: getEnvVar('SLACK_TOKEN') || slack_token,
    slack_url: getEnvVar('SLACK_URL') || slack_url,
    slack_message_heading: getEnvVar('SLACK_MESSAGE_HEADING') || slack_message_heading,
    slack_org_id: getEnvVar('SLACK_ORG_ID') || slack_org_id,

    // Jira
    jira_team_domain: getEnvVar('JIRA_TEAM_DOMAIN') || jira_team_domain,
  };

  return captainsConfig;
};

module.exports = initialize;
