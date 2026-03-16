const express = require("express");
const { orders, getNextId } = require("../shared/orderStore");
const { callJson } = require("../shared/httpClient");

function createOrderServiceApp({ productServiceBaseUrl }) {
  const app = express();
  app.use(express.json());

  app.get("/orders", (req, res) => {
    res.status(200).json(orders);
  });

  app.post("/orders", async (req, res) => {
    const { productId, quantity } = req.body;

    if (
      typeof productId !== "number" ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({ error: "productId and quantity are required" });
    }

    try {
      const product = await callJson(`${productServiceBaseUrl}/products/${productId}`);

      await callJson(`${productServiceBaseUrl}/products/${productId}/stock/decrease`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const newOrder = {
        id: getNextId(),
        productId,
        quantity,
        totalPrice: product.price * quantity,
      };

      orders.push(newOrder);
      return res.status(201).json(newOrder);
    } catch (error) {
      const statusCode = error.status || 500;
      const payload =
        typeof error.payload === "object" && error.payload !== null
          ? error.payload
          : { error: error.message || "Failed to create order" };
      return res.status(statusCode).json(payload);
    }
  });

  return app;
}

module.exports = {
  createOrderServiceApp,
};
