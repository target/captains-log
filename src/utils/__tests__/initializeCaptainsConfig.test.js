const findUp = require('find-up');
const path = require('path');

const initialize = require('../initializeCaptainsConfig');

jest.mock('find-up');
const config = {
  set: jest.fn(),
};

describe('initializeCaptainsConfig', () => {
  it('should not set any config values if there is no `captains.yml` file', () => {
    findUp.sync = jest.fn(() => undefined);

    initialize(config);

    expect(config.set).not.toHaveBeenCalled();
  });

  it('should read from a `captains.yml` file if one exists', () => {
    findUp.sync = jest.fn(() => path.resolve('src/utils/__fixtures__/captains.yml'));

    initialize(config);

    [
      'github:domain',
      'github:host',
      'github:owner',
      'github:repo',
      'github:tagId',
      'github:token',
      'teams',
      'slack:channel',
      'slack:token',
      'slack:channelUrl',
      'jira:teamDomain',
    ].forEach((call, i) => expect(config.set.mock.calls[i][0]).toEqual(call));
  });
});
