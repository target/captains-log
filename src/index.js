/* eslint max-len: [0] */
const { ReleaseCommunication } = require('./facades');
const logger = require('./logger');
const Team = require('./factories/Team');
const Message = require('./factories/Message');
const { createHeadingSection, createFooterSection } = require('./factories/Blocks/section');

const { populateMessages, getTeams, nameSort, formatMessages, generateSlackFormatterUrl } = require('./utils');

const defaultTeam = Team();

const createBlocks = (hasMessages, { owner, repo, teamList, config, head, base }) => {
  let subChannelBlocks = [];
  const customHeading = config.get('slack:messageHeading');
  const heading = createHeadingSection({ owner, repo, head, base, customHeading });
  const footer = createFooterSection();

  if (!hasMessages) {
    return { blocks: [heading, footer] };
  }

  // add all the PRs if there are any
  const blocks = [];
  // team sub-channel attachments
  subChannelBlocks = [];

  const teamsToAttach = [...teamList, defaultTeam];

  teamsToAttach.forEach(team => {
    const msg = Message('slack', team);
    const teamBlocks = msg.generate();

    if (teamBlocks.length) {
      blocks.push(...teamBlocks);

      // if a team has subchannels, generate attatchments to send
      // to those channels here.
      team.channels.forEach(channel => subChannelBlocks.push({ channel, blocks: teamBlocks }));
    }
  });

  return { blocks: [heading, ...blocks, footer], subChannelBlocks };
};

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

  const { blocks, subChannelBlocks = [] } = createBlocks(messages.length, {
    owner,
    repo,
    teamList,
    config,
    head,
    base,
  });

  logger.info(
    `\n Slack Formatter Url. CMD+Click to open in your default browser \n \n ${await generateSlackFormatterUrl(
      blocks,
      config,
    )}`,
  );

  await releaseCommunication.sendMessage(blocks);

  // Send all individual attachments to their respective channels per team.
  if (subChannelBlocks.length) {
    await Promise.all(
      subChannelBlocks.map(({ blocks, channel: subChannel }) =>
        releaseCommunication.sendMessage(blocks, subChannel, true),
      ),
    );
  }
};
