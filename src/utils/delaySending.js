const { promisify } = require('util');

const sleep = promisify(setTimeout);

/**
 *
 * This function will send out one request per second, until all requests have
 * been sent.
 *
 * @param {Function} sender function that needs to be delayed
 * @param {Array} items an array of items to iterate over and process through the sender
 * @param {Number} ms a time in miliseconds that each request should wait for before processing
 */
const delaySending = async function delaySending(sender, items, ms) {
  items.map(async (item, i) => {
    if (i !== 0) await sleep(ms || 1500);

    try {
      sender(item);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = { delaySending };
