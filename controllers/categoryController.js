const { categories, getNextId } = require("../data/store");
const { sendNotFound, sendValidationError } = require("../utils/http");

function getAllCategories(req, res) {
  return res.status(200).json(categories);
}

function getCategoryById(req, res) {
  const id = Number(req.params.id);
  const category = categories.find((item) => item.id === id);

  if (!category) {
    return sendNotFound(res, "Category");
  }

  return res.status(200).json(category);
}

function createCategory(req, res) {
  const { name } = req.body;

  if (!name) {
    return sendValidationError(res, "name is required");
  }

  const newCategory = {
    id: getNextId(categories),
    name,
  };

  categories.push(newCategory);
  return res.status(201).json(newCategory);
}

function updateCategory(req, res) {
  const id = Number(req.params.id);
  const categoryIndex = categories.findIndex((item) => item.id === id);

  if (categoryIndex === -1) {
    return sendNotFound(res, "Category");
  }

  const { name } = req.body;
  if (!name) {
    return sendValidationError(res, "name is required");
  }

  categories[categoryIndex] = { id, name };
  return res.status(200).json(categories[categoryIndex]);
}

function deleteCategory(req, res) {
  const id = Number(req.params.id);
  const categoryIndex = categories.findIndex((item) => item.id === id);

  if (categoryIndex === -1) {
    return sendNotFound(res, "Category");
  }

  const deletedCategory = categories.splice(categoryIndex, 1)[0];
  return res.status(200).json({
    message: "Category deleted successfully",
    category: deletedCategory,
  });
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};