const nconf = require('nconf');

const teamsJSON = nconf.get('teams') || {}; // add a default object if none

let teams = {};

try {
  teams = JSON.parse(teamsJSON);
} catch (e) {
  console.log('No custom teams found (or could not parse teams list).');
}

module.exports = teams;
