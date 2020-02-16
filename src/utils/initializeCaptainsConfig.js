const findUp = require('find-up');
const { readFileSync } = require('fs');
const { safeLoad } = require('js-yaml');

const initialize = config => {
  let conf = {};
  debugger;
  try {
    const yamlConfig = readFileSync(findUp.sync('captains.yml'), 'utf8');
    conf = safeLoad(yamlConfig);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Could not find `captains.yml` file, reverting to environment variables');
    return;
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
  } = conf;

  // Github
  config.set('github:domain', enterprise_host);
  config.set('github:host', github_host);
  config.set('github:owner', github_owner);
  config.set('github:repo', github_repo);
  config.set('github:tagId', github_tag_id);
  config.set('github:token', github_token);

  // Team Configuration
  config.set('teams', teams);

  // Slack
  config.set('slack:channel', slack_channel);
  config.set('slack:token', slack_token);
  config.set('slack:channelUrl', slack_url);

  // Jira
  config.set('jira:teamDomain', jira_team_domain);
};

module.exports = initialize;
