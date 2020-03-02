const findUp = require('find-up');
const path = require('path');

const initialize = require('../initializeCaptainsConfig');

describe('initializeCaptainsConfig', () => {
  it('should not set any config values if there is no `captains.yml` file', () => {
    findUp.sync = jest.fn(() => undefined);

    expect(initialize()).toEqual({
      enterprise_host: undefined,
      github_host: undefined,
      github_owner: undefined,
      github_repo: undefined,
      github_tag_id: undefined,
      github_token: undefined,
      jira_team_domain: undefined,
      slack_channel: undefined,
      slack_message_heading: undefined,
      slack_token: undefined,
      slack_url: undefined,
      teams: undefined,
    });
  });

  it('should read from a `.captains.yml` file if one exists', () => {
    findUp.sync = jest.fn(() => path.resolve('src/utils/__fixtures__/.captains.yml'));

    expect(initialize()).toEqual({
      enterprise_host: undefined,
      github_host: undefined,
      github_owner: 'target',
      github_repo: 'captains-log',
      github_tag_id: 'v([0-9]+-release)$',
      github_token: undefined,
      jira_team_domain: undefined,
      slack_channel: undefined,
      slack_message_heading: undefined,
      slack_token: undefined,
      slack_url: undefined,
      teams: [
        {
          color: '#f06d06',
          emoji: '🐶',
          issueTracking: { jira: { projects: ['CAPN'] } },
          mentions: '<@therynamo>',
          name: 'My Team',
        },
      ],
    });
  });

  it('should read values from the environment', () => {
    process.env.GITHUB_TOKEN = '123';

    expect(initialize().github_token).toEqual('123');
    process.env.GITHUB_TOKEN = '';
  });

  it('it should prioritize env vars over .captians.yml vars', () => {
    process.env.PLUGIN_GITHUB_OWNER = '333';
    expect(initialize().github_owner).toEqual('333');
    process.env.PLUGIN_GITHUB_OWNER = '';
  });

  it('it should use .captians.yml vars when no env vars are provided', () => {
    process.env.PLUGIN_GITHUB_OWNER = '';
    // See __fixtures__/.captains.yml
    expect(initialize().github_owner).toEqual('target');
    process.env.PLUGIN_GITHUB_OWNER = '';
  });
});
