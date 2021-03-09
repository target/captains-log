/* eslint max-len: [0] */
const { ReleaseCommunication } = require('./facades');
const logger = require('./logger');
const Team = require('./factories/Team');

const {
  populateMessages,
  getTeams,
  nameSort,
  formatMessages,
  generateSlackFormatterUrl,
  prepareBlocks,
  sendDelayedMessages,
} = require('./utils');
const { delaySending } = require('./utils/delaySending');
const postToPRHandler = require('./handlers/postToPRHandler');

const defaultTeam = Team();

module.exports = async function App(config) {
  const { repo, owner, tagId, domain: githubDomain } = config.get('github');
  const { teamDomain: jiraTeam } = config.get('jira');
  const { channel, channelUrl } = config.get('slack');
  const teams = getTeams(config);
  const teamList = teams.length ? teams.map(team => Team(team)) : [];

  const releaseCommunication = new ReleaseCommunication({
    owner,
    repo,
    channel,
    channelUrl,
    tagId,
  });

  const { diff, head, base } = await releaseCommunication.diff();

  const changes = await releaseCommunication.parseDiff(diff);
  const messages = changes.reduce((acc, change) => {
    const changeMessages = formatMessages({
      change,
      owner,
      repo,
      head,
      base,
      githubDomain,
      jiraTeam,
    });

    if (changeMessages.length) {
      return [...acc, ...changeMessages];
    }

    return acc;
  }, []);

  const sortedMessages = messages.sort(nameSort);

  populateMessages(defaultTeam)(teamList, sortedMessages);

  const { preparedBlocks, subChannelBlocks = [], loggerBlocks } = prepareBlocks(messages.length, {
    defaultTeam,
    owner,
    repo,
    teamList,
    config,
    head,
    base,
  });

  logger.info(
    `\n Slack Formatter Url. CMD+Click to open in your default browser \n \n ${await generateSlackFormatterUrl(
      loggerBlocks,
      config,
    )}`,
  );

  try {
    await sendDelayedMessages(blocks => releaseCommunication.sendMessage(blocks), preparedBlocks);
  } catch (error) {
    console.log(`Failed to send message to release channel ${error}`);
    throw error;
  }

  // Send all individual attachments to their respective channels per team.
  if (subChannelBlocks.length) {
    try {
      await sendDelayedMessages(({ channel: subChannel, blocks }) => {
        releaseCommunication.sendMessage(blocks, subChannel, true);
      }, subChannelBlocks);
    } catch (error) {
      console.log(`Unable to post to subchannels: ${error}`);
    }
  }

  const { prNumbers } = await releaseCommunication.getUniquePullRequestsFromDiff(diff);

  // By default we opt users into posting back to their pull requests
  // If they use some other tool to do this, or do not want it, we allow
  // them to opt out by adding this to their configuration.
  const shouldNotPostToPr = config.get('github:skip_pr_post');
  if (shouldNotPostToPr) return;

  try {
    await delaySending(
      postToPRHandler,
      prNumbers.map(prNumber => ({
        head,
        owner,
        repo,
        number: prNumber,
      })),
    );
  } catch (error) {
    console.error('Unable to post back to pull requests with release notes:', error);
  }
};
