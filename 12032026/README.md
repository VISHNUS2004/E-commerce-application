# E-commerce Backend (Microservices)

This setup uses separate services with an API gateway.

## Services

- Product Service: http://localhost:4001
- Category Service: http://localhost:4002
- Order Service: http://localhost:4003
- API Gateway: http://localhost:3000

## Run

From workspace root:

```bash
node 12032026/server.js
```

## Gateway Endpoints

- GET /products
- GET /products/:id
- POST /products
- PUT /products/:id
- DELETE /products/:id
- GET /categories
- GET /categories/:id
- POST /categories
- PUT /categories/:id
- DELETE /categories/:id
- GET /orders
- POST /orders

## Order Creation Rules

- Check whether product exists
- Check whether enough stock is available
- Reduce stock after order creation
- Calculate total price automatically
