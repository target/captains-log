const getTeams = require('../teamHelper');

const config = {
  get: jest.fn(),
};

describe('teamHelper', () => {
  it('should return an empty object if there are no teams', () => {
    expect(getTeams(config)).toEqual({});
  });

  it('should return a team object if it is in the form of JSON', () => {
    const teams = [{ name: 'MY_TEAM' }];
    config.get = jest.fn(() => JSON.stringify(teams));

    expect(getTeams(config)).toEqual(teams);
  });

  it('should return a valid js object when a team is passed as a JavaScript object', () => {
    const teams = [{ name: 'MY_TEAM' }];
    config.get = jest.fn(() => teams);

    expect(getTeams(config)).toEqual(teams);
  });
});
