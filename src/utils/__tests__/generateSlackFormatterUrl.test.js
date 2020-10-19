const generateSlackFormatterUrl = require('../generateSlackFormatterUrl');

describe('generateSlackFormatterUrl', () => {
  it('should create a url that links to slack message formatter', async () => {
    const result = await generateSlackFormatterUrl([{ msg: 'hi' }], { get: () => '134' });

    expect(result).toEqual(
      'https://app.slack.com/block-kit-builder/134#%7B"blocks":%5B%7B%22msg%22%3A%22hi%22%7D%5D%7D',
    );
  });
});
