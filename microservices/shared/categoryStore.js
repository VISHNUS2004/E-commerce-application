const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
];

function getNextId() {
  return categories.length ? categories[categories.length - 1].id + 1 : 1;
}

module.exports = {
  categories,
  getNextId,
};
