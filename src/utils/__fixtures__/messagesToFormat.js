const number = '2';
const title = 'fix: The Thing';

const emptyMessages = {
  jira: { tickets: [] },
  github: { tickets: [] },
};

const jiraOnlyMessages = {
  title,
  number,
  jira: { tickets: [{ name: 'CAT-123' }, { name: 'DOG-345' }] },
};

const githubOnlyMessages = {
  title,
  number,
  github: {
    tickets: [
      {
        fullLinkedUrl: 'https://github.com/example_user/example_project/issues/3',
        project: 'example_user/example_project',
        issueNumber: '3',
        name: '3',
      },
      {
        fullLinkedUrl: 'https://github.com/example_user/example_project/issues/4',
        project: 'example_user/example_project',
        issueNumber: '4',
        name: '4',
      },
    ],
  },
};

const allMessages = { ...jiraOnlyMessages, ...githubOnlyMessages };

module.exports = {
  emptyMessages,
  jiraOnlyMessages,
  githubOnlyMessages,
  allMessages,
};
