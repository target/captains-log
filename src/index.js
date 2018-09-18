/* eslint max-len: [0] */
const { ReleaseCommunication } = require('./facades');
const { DEFAULT_HEADING, EMPTY_MESSAGE } = require('./constants');
const logger = require('./logger');
const Team = require('./factories/Team');
const Message = require('./factories/Message');
const { populateMessages, teams, nameSort } = require('./utils');

const defaultTeam = Team();
const teamList = teams.length ? teams.map(team => Team(team)) : [];

const createAttachment = (hasMessages) => {
  let message = EMPTY_MESSAGE;
  let attachments = {};

  if (!hasMessages) {
    return { message, attachments };
  }

  // add all the PRs if there are any
  message = DEFAULT_HEADING;
  attachments = [];

  const teamsToAttach = [...teamList, defaultTeam];

  teamsToAttach.forEach((team) => {
    const msg = Message('slack', team);
    const attachment = msg.generate();

    if (attachment) {
      attachments.push(attachment);
    }
  });

  return { message, attachments };
};

const formatChangeMessage = ({
  change = {}, owner, repo, jiraTeam, githubDomain,
}) => {
  const { jira = [], number, title } = change;
  if (!jira.length) return null;
  return jira.map(ticket => ({
    message: `<https://jira.${jiraTeam}.com/browse/${ticket}|[${ticket}]> - <${githubDomain}/${owner}/${repo}/pull/${number}|#${number}>`,
    name: ticket,
    title,
  }));
};

module.exports = async function App(config) {
  const {
    repo, owner, tagId, domain: githubDomain,
  } = config.get('github');
  const { teamDomain: jiraTeam } = config.get('jira');
  const { channel, channelUrl } = config.get('slack');

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
    const changeMessages = formatChangeMessage({
      change,
      owner,
      repo,
      githubDomain,
      jiraTeam,
    });
    if (changeMessages) {
      return [...acc, ...changeMessages];
    }

    return acc;
  }, []);

  const sortedMessages = messages.sort(nameSort);

  populateMessages(defaultTeam)(teamList, sortedMessages);

  const { message, attachments } = createAttachment(messages.length);
  logger.info(message, JSON.stringify(attachments));

  await releaseCommunication.sendMessage(message, attachments);
};
