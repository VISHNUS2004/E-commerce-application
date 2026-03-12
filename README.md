# E-commerce Backend (Node.js + Express)

Simple in-memory e-commerce backend built using Express.

## Features

- Category management (create, read, update, delete)
- Product management (create, read, update, delete)
- Order creation with stock validation
- Input validation and meaningful HTTP status codes

## Tech Stack

- Node.js
- Express 5

## Project Structure

- `server.js` - API server and in-memory data store
- `package.json` - project metadata and scripts

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

Server runs on:

- `http://localhost:3000`

## API Overview

### Health / Root

- `GET /`

Returns service message and list of available endpoints.

### Categories

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

Create category payload:

```json
{
  "name": "Wearables"
}
```

### Products

- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

Create product payload:

```json
{
  "name": "Smart Watch",
  "price": 3500,
  "stock": 20,
  "categoryId": 1
}
```

### Orders

- `GET /orders`
- `POST /orders`

Create order payload:

```json
{
  "productId": 1,
  "quantity": 2
}
```

## Notes

- Data is stored in memory. Restarting the server resets all categories, products, and orders.
- Default seed data is available in `server.js`.

## Scripts

- `npm start` - start server
- `npm test` - placeholder test script

## Author

Training project for backend practice.
