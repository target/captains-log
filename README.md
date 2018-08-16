# Captains Log

A drone plugin that will send release information via slack.

# Example Drone Usage

```yaml
my-release-log-step:
  image: target/captains-log:1
  secrets: [ SLACK_TOKEN, SLACK_URL, GITHUB_TOKEN ]
  github_owner: ReactTraining
  github_repo: react-media
  slack_channel: reactify
  jira_team_domain: myteamnamespace
  teams:
    - name: Team1
      color: "#FFDC18"
      emoji: "✨"
      mentions: "<@person1>  <@person2>"
      issueTracking:
        - jira:
            projects:
            - TEAM1
            - TEAM1SUBGROUP
    - name: Team2
      color: "#F48642"
      emoji: "🔥"
      mentions: "<@person3>"
      issueTracking:
        - jira:
            projects:
            - TEAM2
```

**Required Fields**

- `github_owner` - Owner of the repository
- `github_repo` - Target repository name
- `jira_team_domain` - (**required** until Jira is not the only issue tracker) - namespace of Jira workspace (e.g. `jira.myteamnamespace.com`)

**Required Secrets**

- `GITHUB_TOKEN` - to fetch github info on releases/tags
- `SLACK_TOKEN` or if you don't have an api token `SLACK_URL` will suffice

**Optional Fields**

- `github_tag_id` - you can use this as regex to match on specific tags.
- `slack_channel`/`SLACK_URL` - when using the API, you should use `slack_channel` to specify which room you'd like to post to. When using `SLACK_URL` you should not specify the room (i.e. `slack_channel`) because the room is already a part of the webhook. ([Setting Up A Webhook (e.g. SLACK_URL)](https://api.slack.com/incoming-webhooks), [Setting Up A Slack Token](https://api.slack.com/docs/token-types#verification))
- `teams` - a list of teams which allows you to organize the output of Captains Log into meaningful chunks. (more below)
- `enterprise_host` - if you use Enterprise Github, this is where you would supply the custom domain. (e.g. https://git.myCompany.com)

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

### Teams Structure

Teams is a list of teams which allows you to logically group the output of Captains Log into focused chunks. You only need a few things to configure a team.

```yaml
teams:
  - name: Team 1
    color: '#f06d06'
    emoji: '🐶'
    mentions: '<@sam.i.am>'
    issueTracking:
      - jira:
          projects:
            - JIRA
```

- name - this value will be used to identify the particular team name in the output
- color - this will be the side strip color of the team's output
- emoji - this will be the emoji next to the team name
- mentions - this value is used to mention any people or groups about this section of the log. (Note: you will need to wrap all mentions in `<>` due to slack conventions)
- issueTracking - **required** - this is a list of different issue trackers. Currently Jira is the only supported issue tracker, there may be more in the future.
  - jira - this value is an object that has a `projects` array inside of it. Any string inside of the `projects` array will be used to match against issues found when scraping pull requests.

If teams are not included, the issues will be grouped alphabetically under a title of `General`.

# Developing

Once you've cloned the repo, make sure everything is running as expected.

```bash
yarn

yarn test
```

Given the tests have passed, you can begin developing. If you'd like to run the tests while your working you can use `yarn test:watch` (runs Jest in watch mode). Be sure to write tests, when applicable, for any new changes.

Once you've completed your work, you should test your changes.

### Testing Your Changes

There are two ways to test your changes.

1.  Command Line - runs node directly, but you have to provide the plugin values
2.  Drone Exec - runs the plugin in drone as it would in the pipeline, you will still have to provide the secrets.

**Command Line**

Drone uses the convention of `PLUGIN_<key>` in order to access yaml variables in plugins. For instance, if you were to create a new key called `super_cool_key` in your `yaml`:

```yaml
my-release-log-step:
  image: target/captains-log:1
  secrets: [ SLACK_TOKEN, SLACK_URL, GITHUB_TOKEN ]
  github_owner: ReactTraining
  github_repo: react-media
  super_cool_key: ROCK STAR
```

In the plugin, you would access that via `process.env.PLUGIN_SUPER_COOL_KEY`.

Drone secrets, however, are their names alone. Therefore, `SLACK_TOKEN`, `SLACK_URL`, and `GITHUB_TOKEN` will all be accessed via those names.

The following is an example of all environment variables you will need in order to run Captains Log:

```bash
GITHUB_TOKEN=<insert_GH_token> PLUGIN_GITHUB_OWNER=<repo_owner> PLUGIN_GITHUB_REPO=<your_repo> PLUGIN_JIRA_TEAM_DOMAIN=<your_namespace> node index.js
```

If you want to run it with `teams`, you can use the following example and modify it as needed:

```bash
GITHUB_TOKEN=<insert_GH_token> PLUGIN_GITHUB_OWNER=<repo_owner> PLUGIN_GITHUB_REPO=<your_repo> PLUGIN_JIRA_TEAM_DOMAIN=<your_namespace> PLUGIN_GITHUB_TAG_ID='v([0-9]+-release)$' PLUGIN_TEAMS="[{\"name\":\"MY_TEAM\",\"color\":\"#FFDC18\",\"emoji\":\"<2728>\",\"mentions\":\"@person1  @person2\",\"issueTracking\":{\"jira\":{\"projects\":[\"DISCO\",\"SUPER\"]}}}]"
```

If you'd like to test sending this to a slack channel, you can either prepend the `SLACK_URL` or `SLACK_TOKEN` and `PLUGIN_SLACK_CHANNEL`.

**Drone Exec**

You'll want to make sure you have the Drone CLI installed: [Instructions here](http://docs.drone.io/cli-installation/).

Once you've got the Drone CLI, you'll want to create a temp or test directory in which you can write to a temporary `.drone.yml` file. Inside of the file you'll start with the basics and then add in the plugin. For example:

```yaml
---
  pipeline:
    captains-log:
      image: target/captains-log:1
      secrets: [ SLACK_TOKEN, SLACK_URL, GITHUB_TOKEN ]
      github_owner: ReactTraining
      github_repo: react-media
      jira_team_domain: myteamnamespace
```

After you've written to the `.drone.yml`, you can run the following in the directory where you've saved your file:

`GITHUB_TOKEN=<your_token> SLACK_URL=<your_webhook_url> drone exec`

(Drone will load the environment variables you pass to it, that way you can simulate secrets with the `exec` command).

This process replicates what the the plugin goes through when running live. If the run passes and you see what you expect, there will be a much higher confidence that things are operating correctly.

# Contributors

Thanks to all of these contributors for making this repo possible.

| [<img src="https://avatars2.githubusercontent.com/u/8508556?s=460&v=4" width="100px;"/><br /><sub><b>Theryn Groetken</b></sub>](https://github.com/therynamo) | [<img src="https://avatars1.githubusercontent.com/u/11198076?s=460&v=4" width="100px;"/><br /><sub><b>Rebecca Mozdy</b></sub>](https://github.com/remoz) | [<img src="https://avatars0.githubusercontent.com/u/615381?s=460&v=4" width="100px;"/><br /><sub><b>Anders D Johnson</b></sub>](https://github.com/AndersDJohnson) |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |


# Code Of Conduct

[Code of Conduct](./CODE_OF_CONDUCT.md)
