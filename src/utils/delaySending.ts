import { promisify } from 'util';

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
export const delaySending = async function delaySending<S extends (v: any) => void, I extends []>(
  sender: S,
  items: I,
  ms?: number,
) {
  // eslint-disable-next-line no-const-assign
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < items.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    if (i !== 0) await sleep(ms || 1500);
    try {
      sender(items[i]);
    } catch (error) {
      console.error(error);
    }
  }
};
