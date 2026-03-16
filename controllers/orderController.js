const { orders, products, getNextId } = require("../data/store");
const { sendNotFound, sendValidationError } = require("../utils/http");

function getAllOrders(req, res) {
  return res.status(200).json(orders);
}

function createOrder(req, res) {
  const { productId, quantity } = req.body;

  if (
    typeof productId !== "number" ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity)
  ) {
    return sendValidationError(res, "productId and quantity are required");
  }

  if (quantity <= 0) {
    return sendValidationError(res, "quantity must be greater than 0");
  }

  const product = products.find((item) => item.id === productId);
  if (!product) {
    return sendNotFound(res, "Product");
  }

  if (product.stock < quantity) {
    return sendValidationError(res, "Not enough stock available");
  }

  product.stock -= quantity;

  const newOrder = {
    id: getNextId(orders),
    productId,
    quantity,
    totalPrice: product.price * quantity,
  };

  orders.push(newOrder);
  return res.status(201).json(newOrder);
}

module.exports = {
  getAllOrders,
  createOrder,
};