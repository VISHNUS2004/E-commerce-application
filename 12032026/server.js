const { createProductServiceApp } = require("./microservices/product-service/app");
const { createCategoryServiceApp } = require("./microservices/category-service/app");
const { createOrderServiceApp } = require("./microservices/order-service/app");
const { createGatewayApp } = require("./microservices/gateway/app");

const PRODUCT_SERVICE_PORT = 4001;
const CATEGORY_SERVICE_PORT = 4002;
const ORDER_SERVICE_PORT = 4003;
const GATEWAY_PORT = 3000;

function startService(name, app, port) {
  app.listen(port, () => {
    console.log(`${name} running at http://localhost:${port}`);
  });
}

startService("Product Service", createProductServiceApp(), PRODUCT_SERVICE_PORT);
startService("Category Service", createCategoryServiceApp(), CATEGORY_SERVICE_PORT);
startService(
  "Order Service",
  createOrderServiceApp({ productServiceBaseUrl: `http://localhost:${PRODUCT_SERVICE_PORT}` }),
  ORDER_SERVICE_PORT
);
startService(
  "API Gateway",
  createGatewayApp({
    productsBaseUrl: `http://localhost:${PRODUCT_SERVICE_PORT}`,
    categoriesBaseUrl: `http://localhost:${CATEGORY_SERVICE_PORT}`,
    ordersBaseUrl: `http://localhost:${ORDER_SERVICE_PORT}`,
  }),
  GATEWAY_PORT
);
