const express = require("express");
const { categories, getNextId } = require("../shared/categoryStore");

function createCategoryServiceApp() {
  const app = express();
  app.use(express.json());

  app.get("/categories", (req, res) => {
    res.status(200).json(categories);
  });

  app.get("/categories/:id", (req, res) => {
    const id = Number(req.params.id);
    const category = categories.find((item) => item.id === id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  });

  app.post("/categories", (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const newCategory = { id: getNextId(), name };
    categories.push(newCategory);
    return res.status(201).json(newCategory);
  });

  app.put("/categories/:id", (req, res) => {
    const id = Number(req.params.id);
    const categoryIndex = categories.findIndex((item) => item.id === id);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    categories[categoryIndex] = { id, name };
    return res.status(200).json(categories[categoryIndex]);
  });

  app.delete("/categories/:id", (req, res) => {
    const id = Number(req.params.id);
    const categoryIndex = categories.findIndex((item) => item.id === id);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    const deletedCategory = categories.splice(categoryIndex, 1)[0];
    return res.status(200).json({ message: "Category deleted successfully", category: deletedCategory });
  });

  return app;
}

module.exports = {
  createCategoryServiceApp,
};
