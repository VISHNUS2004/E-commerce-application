const orders = [];

function getNextId() {
  return orders.length ? orders[orders.length - 1].id + 1 : 1;
}

module.exports = {
  orders,
  getNextId,
};
