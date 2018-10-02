const nameSort = require('../nameSort');

describe('nameSort', () => {
  it('should sort alphabetically', () => {
    const listToSort = [{ name: 'FRANKY-234' }, { name: 'ZEPLIN-24' }, { name: 'ABC-134' }];
    const expectation = [{ name: 'ABC-134' }, { name: 'FRANKY-234' }, { name: 'ZEPLIN-24' }];

    expect(listToSort.sort(nameSort)).toEqual(expectation);
  });

  it('should sort numerically', () => {
    const listToSort = [{ name: '834' }, { name: '24' }, { name: '134' }];
    const expectation = [{ name: '24' }, { name: '134' }, { name: '834' }];

    expect(listToSort.sort(nameSort)).toEqual(expectation);
  });
});
