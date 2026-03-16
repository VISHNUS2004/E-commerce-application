const { products, categories, getNextId } = require("../data/store");
const { sendNotFound, sendValidationError } = require("../utils/http");

function getAllProducts(req, res) {
  return res.status(200).json(products);
}

function getProductById(req, res) {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return sendNotFound(res, "Product");
  }

  return res.status(200).json(product);
}

function createProduct(req, res) {
  const { name, price, stock, categoryId } = req.body;

  if (
    !name ||
    typeof price !== "number" ||
    typeof stock !== "number" ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    typeof categoryId !== "number"
  ) {
    return sendValidationError(res, "name, price, stock, and categoryId are required");
  }

  const categoryExists = categories.some((item) => item.id === categoryId);
  if (!categoryExists) {
    return sendValidationError(res, "categoryId must reference an existing category");
  }

  const newProduct = {
    id: getNextId(products),
    name,
    price,
    stock,
    categoryId,
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
}

function updateProduct(req, res) {
  const id = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return sendNotFound(res, "Product");
  }

  const { name, price, stock, categoryId } = req.body;
  if (
    !name ||
    typeof price !== "number" ||
    typeof stock !== "number" ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    typeof categoryId !== "number"
  ) {
    return sendValidationError(res, "name, price, stock, and categoryId are required");
  }

  const categoryExists = categories.some((item) => item.id === categoryId);
  if (!categoryExists) {
    return sendValidationError(res, "categoryId must reference an existing category");
  }

  products[productIndex] = { id, name, price, stock, categoryId };
  return res.status(200).json(products[productIndex]);
}

function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return sendNotFound(res, "Product");
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  return res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};