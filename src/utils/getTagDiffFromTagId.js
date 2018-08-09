module.exports = (tagId, tags) => {
  const tagIdRegex = new RegExp(tagId, 'g');

  const [head = '', base = ''] = tags.filter(tag => tagIdRegex.test(tag.name));

  return { head: head.name, base: base.name };
};
