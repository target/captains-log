# Base Configuration

There are two primary options for configuration:

- use a configuration file (e.g. `.vela.yml`,`.drone.yml`, etc.) and create a build step with the configuration values required (listed below).
- place a `.captains.yml` file at the root of your directory. Place any required configuration in there. (**note**, you will still need a _Captain's Log build step_, it just will not have any of the configuration values listed there.)

Both are usable, and at the same time. Any environment variable set (e.g. by your CI server) will overwrite any values in the `.captains.yml`.

Suggested configuration would be to place secrets in your CI configuration, and then have all other Captain's Log configurations in the `.captain.yml`.

## Options

**Required Fields**

- `github_owner` - Owner of the the target repository. Example: `github.com/frank/cool_repo`, **frank** would be the _owner_
- `github_repo` - Target repository name. Example: `github.com/frank/cool_repo`, **cool_repo** would be the _repo_

**Required Secrets**

- `GITHUB_TOKEN` - secure github token used to fetch information on releases/tags (consider using a non-user/bot account)
- `SLACK_TOKEN` or `SLACK_URL` - tokens/channel urls are used to send messages to the correct channels

**Optional Fields**

- `enterprise_host` - **Required if** you use Enterprise Github. This is where you would supply the custom domain. (e.g. https://git.myCompany.com, `/api/v3` will be appended to this **do not include it for this value**).
- `jira_team_domain` - **Required if** you use the Jira issue tracker. Namespace of the Jira your workspace (e.g. `jira.myteamnamespace.com`, **myteamnamespace** would be the value for this key).
- `github_tag_id` - you can use this as regex to match on specific tags. Useful when your tags are not in chronological order (e.g. `-rc0`, `-rc1`, `-release`).
- `slack_channel`/`SLACK_URL` - when using the API, you should use `slack_channel` to specify which room you'd like to post to. When using `SLACK_URL` you should **not** specify the room (i.e. `slack_channel`) because the room is already a part of the incoming webhook. ([Setting Up A Webhook (e.g. SLACK_URL)](https://api.slack.com/incoming-webhooks), [Setting Up A Slack Token](https://api.slack.com/docs/token-types#verification))
- `teams` - a list of teams which allows you to organize the output of Captain's Log into meaningful chunks. (more below)
- `slack_message_heading` - you can provide a custom heading for the slack message that is posted, when using this field.
- `github_pr_text` - you can provide custom text that will be inserted into the PR comment when a release is completed.
- `github_skip_pr_comment` - you can skip the PR comment on release by setting this field to `true`.

### Example

#### .vela.yml

```yaml
image: target/captains-log:1
pull: true
secrets: [GITHUB_TOKEN, SLACK_URL]
parameters:
  github_owner: target
  github_repo: captains-log
  github_tag_id: 'v([0-9]+-release)$'
  enterprise_host: https://git.myteam.com
  jira_team_domain: myteamnamespace
  teams: ...
```

#### .drone.yml

```yaml
image: target/captains-log:1
pull: true
secrets:
  - source: GITHUB_TOKEN
    target: GITHUB_TOKEN
  - source: SLACK_URL
    target: SLACK_URL
github_owner: target
github_repo: captains-log
github_tag_id: 'v([0-9]+-release)$'
enterprise_host: https://git.myteam.com
jira_team_domain: myteamnamespace
teams: ...
```

#### .captains.yml

```yaml
image: target/captains-log:1
pull: true
github_token: <token>
slack_url: <slack_url>
github_owner: target
github_repo: captains-log
github_tag_id: 'v([0-9]+-release)$'
enterprise_host: https://git.myteam.com
jira_team_domain: myteamnamespace
teams: ... # see teams configuration below
```

**NOTE**: Allthough you _can_ provide your `github_token` and/or `slack_token/url` (which can _ease_ testing locally), it is advised that you do **NOT** check these tokens into source control. You should always use secrets where applicable.

## Github Tag Ids

**Example of `github_tag_id`**

Some repositories use release candidates, so the format for releasing will look something like this:

```
v2-release
v2-rc1
v2-rc0
v1-release
```

In order to compare against the right tag, you'll want to target the unique identifier. In this example, the `tag_id` used will be a regex matching on numbers and `-release`.

The `yaml` for the plugin would look something like this

```yaml
github_tag_id: 'v([0-9]+-release)$'
```
