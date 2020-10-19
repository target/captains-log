const util = require('util');

jest.mock('util');

const sleepMock = jest.fn();
util.promisify = jest.fn(() => sleepMock);

const { sendDelayedMessages } = require('../sendMessages');

describe('sendDelayedMessages', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should send the first message immediately', async () => {
    const fakeSender = jest.fn();

    await sendDelayedMessages(fakeSender, [[{ msg: 'hi' }]]);

    expect(sleepMock).not.toHaveBeenCalled();
    expect(fakeSender).toHaveBeenCalled();
  });

  it('should send multiple messages, and wait inbetween', async () => {
    const fakeSender = jest.fn();

    util.promisify.mockImplementationOnce(() => time => Promise.resolve(sleepMock(time)));
    await sendDelayedMessages(fakeSender, [[{ msg: 'hi' }], [{ msg: 'hi' }], [{ msg: 'hi' }]]);

    expect(sleepMock).toHaveBeenCalledWith(1500);
    expect(sleepMock).toHaveBeenCalledTimes(2);
    expect(fakeSender).toHaveBeenCalledTimes(3);
  });
});
