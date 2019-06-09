# Examples

Example `.drone.yml` configurations that should provide a starting point for integrating Captain's Log.

## Standard Configuration With No Teams

**Uses `SLACK_URL`**

**Note:** If you're using Jira as your default tracker, you will **need** to provide the `jira_team_domain` or the links will not work properly in the output.

```yaml
my-release-log-step:
  image: target/captains-log:1
  secrets: [ SLACK_URL, GITHUB_TOKEN ]
  github_owner: ReactTraining
  github_repo: react-media
```

## Standard Jira Configuration With Teams

**Uses `SLACK_TOKEN`**

```yaml
my-release-log-step:
  image: target/captains-log:1
  secrets: [ SLACK_TOKEN, GITHUB_TOKEN ]
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
        jira:
          projects:
            - TEAM1
            - TEAM1SUBGROUP
    - name: Team2
      color: "#F48642"
      emoji: "🔥"
      mentions: "<@person3>"
      issueTracking:
        jira:
          projects:
            - TEAM2
```

## Standard Github Configuration With Teams

```yaml
my-release-log-step:
  image: target/captains-log:1
  secrets: [ SLACK_URL, GITHUB_TOKEN ]
  github_owner: ReactTraining
  github_repo: react-media
  teams:
    - name: Team1
      channels:
        - my-teams-private-channel
      color: "#FFDC18"
      emoji: "✨"
      mentions: "<@person1>  <@person2>"
      issueTracking:
        github:
          projects:
            - ReactTraining/waffle_repo
```

---

Next: [Including issues in Captain's Log](/pr-body/).
