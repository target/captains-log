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

    expect(config.set).toHaveBeenCalledTimes(11);
  });
});
