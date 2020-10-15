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

  await sendDelayedMessages(blocks => releaseCommunication.sendMessage(blocks), preparedBlocks);

  // Send all individual attachments to their respective channels per team.
  if (subChannelBlocks.length) {
    await sendDelayedMessages(
      ({ channel: subChannel, blocks }) => releaseCommunication.sendMessage(blocks, subChannel, true),
      subChannelBlocks,
    );
  }
};
