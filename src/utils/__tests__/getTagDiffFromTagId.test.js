const getTagDiffFromTagId = require('../getTagDiffFromTagId');

const regexp = 'v([0-9]+-release)$';

describe('getTagDiffFromTagId', () => {
  let tags = [];

  beforeEach(() => {
    tags = [{ name: 'v301-release' }, { name: 'v301-rc0' }, { name: 'v300-release' }];
  });

  it('should retrieve the first two tags based on the regexp passed', () => {
    const { head, base } = getTagDiffFromTagId(regexp, tags);

    expect(head).toEqual('v301-release');
    expect(base).toEqual('v300-release');
  });
});
