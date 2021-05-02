# Using Teams to Structure Output

`teams` is a **list** of teams which allows you to logically group the output of Captain's Log into focused chunks. You only need a few things to configure a team.

( will work for _both_ `.captains.yml` and CI configuration file (e.g.`.vela.yml`))

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
