const fs = require('fs').promises;
const path = require('path');

/**
 * Dynamically imports any finders that are placed in `./finders`
 * @return {Promise} resolves to Array of finder functions
 */
const getFinderFunctions = async () => {
  const finderPath = `${__dirname}/finders`;
  const finderDirs = await fs.readdir(finderPath);

  const finderFiles = await Promise.all(finderDirs.map(async (file) => {
    const filePath = path.resolve(finderPath, file);
    const stats = await fs.lstat(filePath);
    const isDir = stats.isDirectory();

    if (isDir) return file;

    return null;
  }));

  const finderFunctions = finderFiles.filter(n => n).map(file => require(`${finderPath}/${file}`)); // eslint-disable-line

  return finderFunctions;
};

/**
 * Finds tickets in pull request based on pre-defined regexs
 * @param  {String}    pr pull request response
 * @return {Promise}      resolves to return an object with separated buckets that have matches
 */
const ticketFinder = async (pr) => {
  const finders = await getFinderFunctions();
  const ticketMap = {};

  finders.forEach((finder) => {
    const { name = null, tickets } = finder(pr);

    if (!ticketMap[name]) {
      ticketMap[name] = {};
    }

    ticketMap[name] = { ...ticketMap[name], name, tickets };
  });

  return { ...ticketMap };
};

module.exports = ticketFinder;
