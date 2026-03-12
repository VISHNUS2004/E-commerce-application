const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const categories = [
  { id: 1, name: "Accessories" },
  { id: 2, name: "Audio" }
];

const products = [
  { id: 1, name: "Keyboard", price: 1200, stock: 10, categoryId: 1 },
  { id: 2, name: "Mouse", price: 800, stock: 15, categoryId: 1 },
  { id: 3, name: "Headset", price: 2000, stock: 8, categoryId: 2 }
];

const orders = [];
let nextCategoryId = 3;
let nextProductId = 4;
let nextOrderId = 1;

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "E-commerce backend is running",
    endpoints: [
      "GET /categories",
      "POST /categories",
      "PUT /categories/:id",
      "DELETE /categories/:id",
      "GET /products",
      "POST /products",
      "PUT /products/:id",
      "DELETE /products/:id",
      "GET /orders",
      "POST /orders"
    ]
  });
});

app.get("/categories", (req, res) => {
  return res.status(200).json(categories);
});

app.post("/categories", (req, res) => {
  const { name } = req.body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const categoryExists = categories.some(
    (category) => category.name.toLowerCase() === name.trim().toLowerCase()
  );

  if (categoryExists) {
    return res.status(409).json({ message: "Category name already exists" });
  }

  const newCategory = {
    id: nextCategoryId++,
    name: name.trim()
  };

  categories.push(newCategory);
  return res.status(201).json(newCategory);
});

app.put("/categories/:id", (req, res) => {
  const categoryId = Number(req.params.id);
  const { name } = req.body;

  if (!isPositiveInteger(categoryId)) {
    return res.status(400).json({ message: "Invalid category id" });
  }

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const duplicateName = categories.some(
    (item) => item.id !== categoryId && item.name.toLowerCase() === name.trim().toLowerCase()
  );

  if (duplicateName) {
    return res.status(409).json({ message: "Category name already exists" });
  }

  category.name = name.trim();
  return res.status(200).json(category);
});

app.delete("/categories/:id", (req, res) => {
  const categoryId = Number(req.params.id);

  if (!isPositiveInteger(categoryId)) {
    return res.status(400).json({ message: "Invalid category id" });
  }

  const categoryIndex = categories.findIndex((item) => item.id === categoryId);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: "Category not found" });
  }

  const hasLinkedProducts = products.some((product) => product.categoryId === categoryId);

  if (hasLinkedProducts) {
    return res.status(400).json({
      message: "Cannot delete category with linked products"
    });
  }

  const deletedCategory = categories.splice(categoryIndex, 1)[0];
  return res.status(200).json(deletedCategory);
});

app.get("/products", (req, res) => {
  return res.status(200).json(products);
});

app.post("/products", (req, res) => {
  const { name, price, stock, categoryId } = req.body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: "Product name is required" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  if (!isPositiveInteger(stock)) {
    return res.status(400).json({ message: "Stock must be a positive integer" });
  }

  if (!isPositiveInteger(categoryId)) {
    return res.status(400).json({ message: "categoryId must be a positive integer" });
  }

  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const newProduct = {
    id: nextProductId++,
    name: name.trim(),
    price,
    stock,
    categoryId
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const { name, price, stock, categoryId } = req.body;

  if (!isPositiveInteger(productId)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      return res.status(400).json({ message: "name must be a non-empty string" });
    }
    product.name = name.trim();
  }

  if (price !== undefined) {
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "price must be a positive number" });
    }
    product.price = price;
  }

  if (stock !== undefined) {
    if (!isPositiveInteger(stock)) {
      return res.status(400).json({ message: "stock must be a positive integer" });
    }
    product.stock = stock;
  }

  if (categoryId !== undefined) {
    if (!isPositiveInteger(categoryId)) {
      return res.status(400).json({ message: "categoryId must be a positive integer" });
    }

    const category = categories.find((item) => item.id === categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    product.categoryId = categoryId;
  }

  return res.status(200).json(product);
});

app.delete("/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  if (!isPositiveInteger(productId)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const productIndex = products.findIndex((item) => item.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  return res.status(200).json(deletedProduct);
});

app.get("/orders", (req, res) => {
  return res.status(200).json(orders);
});

app.post("/orders", (req, res) => {
  const { productId, quantity } = req.body;

  if (!isPositiveInteger(productId) || !isPositiveInteger(quantity)) {
    return res.status(400).json({
      message: "productId and quantity must be positive integers"
    });
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      message: "Insufficient stock",
      availableStock: product.stock
    });
  }

  const totalPrice = product.price * quantity;
  product.stock -= quantity;

  const newOrder = {
    id: nextOrderId++,
    productId,
    quantity,
    totalPrice
  };

  orders.push(newOrder);

  return res.status(201).json(newOrder);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
