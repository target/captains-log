const truncate = (str, length = 34) => {
  // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-16.php
  const ending = '...';
  return (
    str.length > length ? str.substring(0, length - ending.length) + ending : str
  );
};

module.exports = truncate;
