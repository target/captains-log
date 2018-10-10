const nameSort = (a, b) => {
  let aNum = null;
  let bNum = null;

  aNum = parseInt(a.name, 10);
  bNum = parseInt(b.name, 10);

  if (aNum && bNum) {
    return aNum - bNum;
  }

  // MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

module.exports = nameSort;
