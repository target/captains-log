/* eslint max-len: [0] */
const { ReleaseCommunication } = require('./facades');
const { DEFAULT_HEADING, EMPTY_MESSAGE } = require('./constants');
const logger = require('./logger');
const Team = require('./factories/Team');
const Message = require('./factories/Message');

const { populateMessages, getTeams, nameSort, formatMessages, generateSlackFormatterUrl } = require('./utils');

const defaultTeam = Team();

const createAttachment = (hasMessages, { owner, repo, teamList, config }) => {
  let message = EMPTY_MESSAGE(owner, repo);
  let attachments = [];
  let subChannelAttachments = [];

  if (!hasMessages) {
    return { message, attachments };
  }

  // add all the PRs if there are any
  const customHeading = config.get('slack:messageHeading');
  message = customHeading || DEFAULT_HEADING(owner, repo);
  attachments = [];
  // team sub-channel attachments
  subChannelAttachments = [];

  const teamsToAttach = [...teamList, defaultTeam];

  teamsToAttach.forEach(team => {
    const msg = Message('slack', team);
    const attachment = msg.generate();

    if (attachment) {
      attachments.push(attachment);

      // if a team has subchannels, generate attatchments to send
      // to those channels here.
      team.channels.forEach(channel => subChannelAttachments.push({ channel, attachment }));
    }
  });

  return { message, attachments, subChannelAttachments };
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

  const diff = await releaseCommunication.diff();
  const changes = await releaseCommunication.parseDiff(diff);
  const messages = changes.reduce((acc, change) => {
    const changeMessages = formatMessages({
      change,
      owner,
      repo,
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

  const { message, attachments, subChannelAttachments = [] } = createAttachment(messages.length, {
    owner,
    repo,
    teamList,
    config
  });


  logger.info(`\n Slack Formatter Url. CMD+Click to open in your default browser \n \n ${generateSlackFormatterUrl(attachments)}`);

  await releaseCommunication.sendMessage(message, attachments);

  // Send all individual attachments to their respective channels per team.
  if (subChannelAttachments.length) {
    await Promise.all(subChannelAttachments.map(({ attachment, channel: subChannel }) =>
      releaseCommunication.sendMessage(message, [attachment], subChannel, true)));
  }
};
