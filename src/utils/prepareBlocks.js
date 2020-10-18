const { chunk } = require('lodash');

const Message = require('../factories/Message');
const { createHeadingSection, createFooterSection, createEmptyRelease } = require('../factories/Blocks/section');

/**
 * Slack has a 50 block limit, per message. We need to chunk blocks so we can send them
 * in separate messages if there are more than 50 blocks in a message.
 *
 * More here: https://api.slack.com/reference/block-kit/blocks
 * @param {Object} heading heading section
 * @param {Array} blocks team blocks to be inserted
 * @param {Object} footer footer section
 */
const chunkBlocks = (heading, blocks, footer) => {
  const allBlocks = [heading, ...blocks, footer];

  if (allBlocks.length <= 50) return [allBlocks];

  const chunkedBlocks = chunk(blocks, 49);

  chunkedBlocks[0].unshift(heading);
  chunkedBlocks[chunkedBlocks.length - 1].push(footer);

  return chunkedBlocks;
};

const createBlocks = (hasMessages, { owner, repo, teamList, config, head, base, defaultTeam }) => {
  const subChannelBlocks = [];
  const customHeading = config.get('slack:messageHeading');
  const domain = config.get('github:domain');

  const heading = createHeadingSection({ domain, owner, repo, head, base, customHeading });
  const footer = createFooterSection();

  // We return an empty header and footer if there are no messages
  if (!hasMessages) {
    const defaultBlocks = [[heading, createEmptyRelease(), footer]];
    return { preparedBlocks: defaultBlocks, loggerBlocks: defaultBlocks };
  }

  const blocks = [];

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

  return {
    preparedBlocks: chunkBlocks(heading, blocks, footer),
    subChannelBlocks,
    loggerBlocks: [heading, ...blocks, footer],
  };
};

module.exports = createBlocks;
