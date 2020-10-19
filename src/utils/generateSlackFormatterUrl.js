const tinyurl = require('tinyurl');

const generateSlackFormatterUrl = async (blocks, config) => {
  const baseSlackUrl = `https://app.slack.com/block-kit-builder/${config.get('slack:orgId')}#`;
  let url;

  const stringifiedBlocks = JSON.stringify(blocks);
  const stringifiedQuery = encodeURIComponent(stringifiedBlocks);

  const longUrl = `${baseSlackUrl}%7B"blocks":${stringifiedQuery}%7D`;

  if (process.env.ENABLE_TINY) {
    url = await tinyurl.shorten(longUrl);
  }

  return url || longUrl;
};

module.exports = generateSlackFormatterUrl;
