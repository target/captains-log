module.exports = (tagId, tags) => {
  const tagIdRegex = new RegExp(tagId);

  const [head = '', base = ''] = tags.filter(tag => tagIdRegex.test(tag.name));

  return { head: head.name, base: base.name };
};
