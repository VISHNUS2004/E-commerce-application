const products = [
  { id: 1, name: "Wireless Mouse", price: 799, stock: 10, categoryId: 1 },
  { id: 2, name: "Node.js Handbook", price: 499, stock: 15, categoryId: 2 },
];

function getNextId() {
  return products.length ? products[products.length - 1].id + 1 : 1;
}

module.exports = {
  products,
  getNextId,
};
