# Configuration

There are two options for configuration:

- use the `.drone.yml` and create a build step with the configuration values required (listed below).
- place a `.captains.yml` file at the root of your directory. Place any required configuration in there. (**note**, you will still need a _Captain's Log build step_, it just will not have any of the configuration values listed there.)

Both are usable, and at the same time. The `.captains.yml` will overwrite any variable that is in an `environment variable` (aka `.drone.yml` configurations).

Suggested configuration would be to place secrets in your CI configuration, and then have all other Captain's Log configurations in the `.captain.yml`. 

## Options

**Required Fields**

- `github_owner` - Owner of the the target repository. Example: `github.com/frank/cool_repo`, **frank** would be the _owner_
- `github_repo` - Target repository name. Example: `github.com/frank/cool_repo`, **cool_repo** would be the _repo_

**Required Secrets**

- `GITHUB_TOKEN` - secure github token used to fetch information on releases/tags (consider using a non-user/bot account)
- `SLACK_TOKEN` or `SLACK_URL` - tokens/channel urls are used to send messages to the correct channels

**Optional Fields**

- `jira_team_domain` - **Required** if you use the Jira issue tracker. Namespace of the Jira your workspace (e.g. `jira.myteamnamespace.com`, **myteamnamespace** would be the value for this key).
- `github_tag_id` - you can use this as regex to match on specific tags. Useful when your tags are not in chronological order (e.g. `-rc0`, `-rc1`, `-release`).
- `slack_channel`/`SLACK_URL` - when using the API, you should use `slack_channel` to specify which room you'd like to post to. When using `SLACK_URL` you should **not** specify the room (i.e. `slack_channel`) because the room is already a part of the incoming webhook. ([Setting Up A Webhook (e.g. SLACK_URL)](https://api.slack.com/incoming-webhooks), [Setting Up A Slack Token](https://api.slack.com/docs/token-types#verification))
- `teams` - a list of teams which allows you to organize the output of Captain's Log into meaningful chunks. (more below)
- `enterprise_host` - **Required** if you use Enterprise Github. This is where you would supply the custom domain. (e.g. https://git.myCompany.com, `/api/v3` will be appended to this **do not include it for this value**).

### Example

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

## Using Teams to Structure Output

`teams` is a **list** of teams which allows you to logically group the output of Captain's Log into focused chunks. You only need a few things to configure a team.

( will work for _both_ `.captains.yml` and `.drone.yml`)

```yaml
teams:
  - name: Team 1
    channels:
      - my-first-channel
      - my-second-channel
    color: '#f06d06'
    emoji: '🐶'
    mentions: '<@sam.i.am>'
    issueTracking:
      github:
        projects:
          - my_org/my_repo
      jira:
        projects:
          - MYJIRA
```

- `name` - this value will be used to identify the particular team name in the output
- `channels` - this list allows you to send your teams log to individual channels outside of the default channel for Captain's Log. These can be either channel names or channel IDs ([read more here](https://api.slack.com/methods/chat.postMessage)). Note, this feature is only available when using "slack tokens" for authentication **along side of** or **in place** of slack urls. If you're sending a message to a private room, be sure the Slack app (associated token) has access to send messages to that room, or Captain's Log will not be able to send a message to that channel.
- `color` - this will be the side strip color of the team's output
- `emoji` - this will be the emoji next to the team name
- `mentions` - this value is used to mention any people or groups about this section of the log. You will need to wrap all mentions in `<>` due to slack conventions. You can mention groups by using the following format: `<!subteam^1234ASDF|super-cool-team>` where **super-cool-team** is the group and `1234ASDF` is the unique group identifier, which you can find as follows:
  - Open your Slack workspace on the web client (e.g., https://our-space.slack.com)
  - Click the settings menu in the upper right (three dots stacked vertically)
  - Choose "User Groups" from that menu - a side panel will open.
  - In the side panel, search for the group in question and, once found, click on it.
  - Now look at the URL - the group ID is the last segment in the path (e.g., `1234ASDF` in https://our-space.slack.com/messages/ABCD12345/groups/1234ASDF/)
- `issueTracking` - **required** - this is a list of different issue trackers. Currently Jira is the only supported issue tracker, there may be more in the future.
  - `jira` - this value is an object that has a `projects` array inside of it. Any string inside of the `projects` array will be used to match against issues found when scraping pull requests. For example `MYJIRA` will match `https://jira.myteamnamespace.com/browse/MYJIRA-1234`.
  - `github` - this value is an object that has a `projects` array inside of it. You'll want to use a project value that will match issues found. For instance, if you're trying to match `https://github.com/my_waffle/waffle_team` you would use the value of `my_waffle/waffle_team`.

If teams are not included, the issues will be grouped alphabetically under a title of `General`.

---

Next: [Examples](/examples/)
