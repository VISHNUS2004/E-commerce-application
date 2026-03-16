const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
];

const products = [
  { id: 1, name: "Wireless Mouse", price: 799, stock: 10, categoryId: 1 },
  { id: 2, name: "Node.js Handbook", price: 499, stock: 15, categoryId: 2 },
];

const orders = [
  { id: 1, productId: 1, quantity: 2, totalPrice: 1598 },
];

function getNextId(collection) {
  return collection.length ? collection[collection.length - 1].id + 1 : 1;
}

module.exports = {
  categories,
  products,
  orders,
  getNextId,
};