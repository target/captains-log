jest.mock('node-fetch');
jest.mock('../../connectors/GithubConnector');
jest.mock('../../connectors/SlackConnector');

const fetch = require('node-fetch');
const { Slack: slack } = require('../../connectors');
const postMessageHandler = require('../postMessageHandler');

describe('postMessageHandler', () => {
  it('should use slack api when no channelUrl is provided', async () => {
    postMessageHandler({
      channel: 'abc',
      text: 'abcdefg',
    });

    expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
  });
  it('should use fetch when channelUrl is provided', async () => {
    const url = 'https://www.slackendpoing.com/org/room/token';
    postMessageHandler({
      channel: 'abc',
      text: 'abcdefg',
      channelUrl: url,
    });

    const expectedUrl = url;
    const expectedOptions = {
      method: 'POST',
      body: '{"channel":"abc","username":"Drone","text":"abcdefg","icon_emoji":":female-pilot:"}',
      headers: { 'Content-Type': 'application/json' },
    };

    expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
  });

  it('should return empty object when no channel or channelUrl is provided', async () => {
    const messageResponse = await postMessageHandler({
      text: 'abcdefg',
    });

    expect(messageResponse).toEqual({});
  });
});
