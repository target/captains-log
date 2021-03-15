import { AppConfig, Teams } from '../types';

const getTeams = (config: AppConfig) => {
  let teams: Teams[] = [];
  const teamsJSON = config.get('teams') || [];

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

export default getTeams;
