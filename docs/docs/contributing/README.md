# Contributing

## Developing

Once you've cloned the repo, make sure everything is running as expected.

```bash
yarn

yarn test
```

Given the tests have passed, you can begin developing. If you'd like to run the tests while you're working you can use `yarn test:watch` (runs Jest in watch mode). Be sure to write tests, when applicable, for any new changes.

Once you've completed your work, you should test your changes.

## Testing Your Changes

There are different ways to test your changes.

1.  Command Line - runs node directly, but you have to provide the plugin values
2.  Drone Exec - runs the plugin in drone as it would in the pipeline, you will still have to provide the secrets.
3.  Vela exec - _coming soon_

### Command Line

Vela uses the convention `PARAMETER_<key>`. Drone uses the convention of `PLUGIN_<key>` in order to access yaml variables in plugins. For instance, if you were to create a new key called `super_cool_key` in your `yaml`:

```yaml
my-release-log-step:
  image: target/captains-log:1
  secrets: [ SLACK_TOKEN, SLACK_URL, GITHUB_TOKEN ]
  github_owner: ReactTraining
  github_repo: react-media
  super_cool_key: ROCK STAR
```

In the plugin, you would access that via `process.env.PARAMETER` or `process.env.PLUGIN_SUPER_COOL_KEY`.

Vela and Drone secrets, however, are their names alone. Therefore, `SLACK_TOKEN`, `SLACK_URL`, and `GITHUB_TOKEN` will all be accessed via those names.

The following is an example of all environment variables you will need in order to run Captains Log:

```bash
GITHUB_TOKEN=<insert_GH_token> PLUGIN_GITHUB_OWNER=<repo_owner> PLUGIN_GITHUB_REPO=<your_repo> PLUGIN_JIRA_TEAM_DOMAIN=<your_namespace> node index.js
```

If you want to run it with `teams`, you can use the following example and modify it as needed:

```bash
GITHUB_TOKEN=<insert_GH_token> PLUGIN_GITHUB_OWNER=<repo_owner> PLUGIN_GITHUB_REPO=<your_repo> PLUGIN_JIRA_TEAM_DOMAIN=<your_namespace> PLUGIN_GITHUB_TAG_ID='v([0-9]+-release)$' PLUGIN_TEAMS="[{\"name\":\"MY_TEAM\",\"color\":\"#FFDC18\",\"emoji\":\"<2728>\",\"mentions\":\"@person1  @person2\",\"issueTracking\":{\"jira\":{\"projects\":[\"DISCO\",\"SUPER\"]}}}]"
```

If you'd like to test sending this to a slack channel, you can either prepend the `SLACK_URL` or `SLACK_TOKEN` and `PLUGIN_SLACK_CHANNEL`.

### Drone Exec

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

---

Next: [Code of Conduct](/code-of-conduct/)
