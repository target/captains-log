const idx = require('idx');
const config = require('../../config');

const githubDomain = config.get('github:domain') || 'https://github.com';

const createStorySection = function createStorySection(message) {
  const isGitIssue = message.url.includes('git');

  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${isGitIssue ? `*${idx(message, _ => _.meta.ticket.project)} #` : '*'}${message.name}*: _${message.title}_`,
    },
    accessory: {
      type: 'overflow',
      options: [
        {
          text: {
            type: 'plain_text',
            text: `💻 View PR: #${message.meta.number}`,
            emoji: true,
          },
          value: `${message.meta.number}`,
          url: message.githubPr,
        },
        {
          text: {
            type: 'plain_text',
            text: `🔖 See Issue: ${isGitIssue ? '#' : ''}${message.name}`,
            emoji: true,
          },
          value: `${message.name}`,
          url: message.url,
        }
      ],
      action_id: 'overflow-action',
    },
  };
};

const createHeadingSection = function createHeadingSection({ owner, repo, head, base, customHeading = null }) {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: customHeading || `🚀 ${owner}/${repo} deployed to production!`
    },
    accessory: {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'View Release'
      },
      url: `${githubDomain}/${owner}/${repo}/compare/${base}...${head}`
    },
  };
};

const createFooterSection = function createFooterSection() {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'Don\'t see your issue, or think there\'s a bug? 👉'
    },
    accessory: {
      type: 'overflow',
      options: [
        {
          text: {
            type: 'plain_text',
            text: '✍ Check the docs',
            emoji: true,
          },
          value: 'docs',
          url: 'https://target.github.io/captains-log/#/configuration/'
        },
        {
          text: {
            type: 'plain_text',
            text: '🐛 Report a bug',
            emoji: true,
          },
          value: 'bug',
          url: 'https://github.com/target/captains-log/issues/new/choose'
        },
      ],
      action_id: 'overflow-action'
    },
  };
};

const createMentions = function createMentions(mentions) {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `Attention to: ${mentions}` || ' ',
    },
  };
};

module.exports = {
  createHeadingSection,
  createStorySection,
  createFooterSection,
  createMentions,
}