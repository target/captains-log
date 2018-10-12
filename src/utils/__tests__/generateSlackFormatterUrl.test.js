const querystring = require('querystring');
const generateSlackFormatterUrl = require('../generateSlackFormatterUrl');

describe('generateSlackFormatterUrl', () => {
  it('should create a url that links to slack message formatter', () => {
    const fakeAttachments = [{ fallback: 'asdf', fields: [{ title: 'Funky', value: 'Ooops', short: true }] }];
    const expectedResult =
      'https://api.slack.com/docs/messages/builder?msg=%7B%22attachments%22%3A%5B%7B%22fallback%22%3A%22asdf%22%2C%22fields%22%3A%5B%7B%22title%22%3A%22Funky%22%2C%22value%22%3A%22Ooops%22%2C%22short%22%3Atrue%7D%5D%7D%5D%7D'; // eslint-disable-line

    const result = generateSlackFormatterUrl(fakeAttachments);
    const parsedResult = JSON.parse(Object.values(querystring.parse(result)));

    expect(result).toEqual(expectedResult);
    expect(parsedResult.attachments).toEqual(fakeAttachments);
  });
});
