const getTeams = config => {
  let teams = {};
  const teamsJSON = config.get('teams') || {};

  try {
    teams = JSON.parse(teamsJSON);
  } catch (e) {
    if (!Object.keys(teamsJSON).length) {
      // eslint-disable-next-line no-console
      console.log('No custom teams found (or could not parse teams list).');
    }

    // Teams is already parsed with captains.yml
    teams = teamsJSON;
  }

  return teams;
};

module.exports = getTeams;
