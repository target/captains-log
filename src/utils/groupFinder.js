/* eslint no-cond-assign: 0, no-plusplus: 0, no-param-reassign: 0 */

// Partially taken from regex101 codegen
module.exports = function groupFinder(regexp, text) {
  const groups = [];
  let m = [];

  while ((m = regexp.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    groups.push(m[1]);
  }

  return groups;
};
