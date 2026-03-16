const express = require("express");
const { products, getNextId } = require("../shared/productStore");

function createProductServiceApp() {
  const app = express();
  app.use(express.json());

  app.get("/products", (req, res) => {
    res.status(200).json(products);
  });

  app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  });

  app.post("/products", (req, res) => {
    const { name, price, stock, categoryId } = req.body;
    if (
      !name ||
      typeof price !== "number" ||
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      typeof categoryId !== "number"
    ) {
      return res.status(400).json({ error: "name, price, stock, and categoryId are required" });
    }

    const newProduct = { id: getNextId(), name, price, stock, categoryId };
    products.push(newProduct);
    return res.status(201).json(newProduct);
  });

  app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const productIndex = products.findIndex((item) => item.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
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
      return res.status(400).json({ error: "name, price, stock, and categoryId are required" });
    }

    products[productIndex] = { id, name, price, stock, categoryId };
    return res.status(200).json(products[productIndex]);
  });

  app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const productIndex = products.findIndex((item) => item.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    return res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  });

  app.patch("/products/:id/stock/decrease", (req, res) => {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    const product = products.find((item) => item.id === id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    product.stock -= quantity;
    return res.status(200).json(product);
  });

  return app;
}

module.exports = {
  createProductServiceApp,
};
