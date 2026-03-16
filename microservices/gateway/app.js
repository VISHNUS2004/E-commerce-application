const express = require("express");

async function forwardRequest(req, res, targetBaseUrl) {
  try {
    const targetUrl = `${targetBaseUrl}${req.originalUrl}`;

    const requestOptions = {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
    };

    if (!["GET", "DELETE"].includes(req.method)) {
      requestOptions.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(targetUrl, requestOptions);
    const contentType = response.headers.get("content-type") || "";

    res.status(response.status);

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      return res.json(payload);
    }

    const payload = await response.text();
    return res.send(payload);
  } catch (error) {
    return res.status(502).json({ error: "Gateway could not reach service" });
  }
}

function createGatewayApp({ productsBaseUrl, categoriesBaseUrl, ordersBaseUrl }) {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "E-commerce API Gateway",
      services: {
        products: productsBaseUrl,
        categories: categoriesBaseUrl,
        orders: ordersBaseUrl,
      },
      endpoints: [
        "GET /products",
        "GET /products/:id",
        "POST /products",
        "PUT /products/:id",
        "DELETE /products/:id",
        "GET /categories",
        "GET /categories/:id",
        "POST /categories",
        "PUT /categories/:id",
        "DELETE /categories/:id",
        "GET /orders",
        "POST /orders",
      ],
    });
  });

  app.use("/products", (req, res) => forwardRequest(req, res, productsBaseUrl));
  app.use("/categories", (req, res) => forwardRequest(req, res, categoriesBaseUrl));
  app.use("/orders", (req, res) => forwardRequest(req, res, ordersBaseUrl));

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
}

module.exports = {
  createGatewayApp,
};
