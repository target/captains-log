const JiraTracker = function JiraTracker(tracker = {}) {
  const { projects = [] } = tracker;

  return {
    matches: projects,
  };
};

const IssueTracker = function IssueTracker(issueTrackers = {}) {
  const trackerList = Object.keys(issueTrackers);

  const constructedTrackers = trackerList.reduce((acc, tracker) => {
    if (acc[tracker]) return acc;

    switch (tracker) {
      case 'jira':
        acc[tracker] = JiraTracker(issueTrackers[tracker]);
        break;
      default:
        break;
    }

    return acc;
  }, {});

  return constructedTrackers;
};

module.exports = IssueTracker;
