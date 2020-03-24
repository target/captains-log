const querystring = require('querystring');

const generateSlackFormatterUrl = attachments => {
  const baseSlackUrl = 'https://api.slack.com/docs/messages/builder?';

  const attachmentsToStringify = JSON.stringify({
    attachments,
  });

  const stringifiedQuery = querystring.stringify({ msg: attachmentsToStringify });

  return `${baseSlackUrl}${stringifiedQuery}`;
};

module.exports = generateSlackFormatterUrl;
