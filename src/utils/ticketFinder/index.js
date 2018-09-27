const fs = require('fs').promises;
const path = require('path');

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

const ticketFinder = async (body) => {
  const finders = await getFinderFunctions();
  const ticketMap = {};

  finders.forEach((finder) => {
    const { tickets = null, name = null } = finder(body);

    if (tickets) {
      if (!ticketMap[name]) {
        ticketMap[name] = [];
      }

      ticketMap[name].push(...tickets);
    }
  });

  return { ...ticketMap };
};

module.exports = ticketFinder;
