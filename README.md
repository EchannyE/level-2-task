# Product API

REST API for user authentication and product catalog management using Express, MongoDB, and JWT-based authorization.

## Overview

This project is structured as a small backend service with:

- user registration and login service logic
- JWT authentication middleware
- role-based authorization for admin-only product mutations
- MongoDB models managed through Mongoose
- product CRUD operations

The API is mounted from [src/server.js](src/server.js).

## Tech Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- cors
- dotenv
- morgan

## Project Structure

```text
product-api/
  package.json
  .env
  src/
    server.js
    config/
      db.js
    controllers/
      authController.js
      productController.js
    middleware/
      authMiddleware.js
      roleMiddleware.js
    models/
      Product.js
      User.js
    scripts/
      seedAdmin.js
    routes/
      authRoutes.js
      productRoutes.js
    services/
      authService.js
      productService.js
    utils/
      generateToken.js
```

## Features

- Health check endpoint
- JWT token generation with configurable expiry
- Protected product read endpoints
- Admin-only product creation, update, and deletion
- Product creator reference via `createdBy`
- Basic service-layer separation between controllers and database logic

## Environment Variables

Example `.env` values:

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/product_catalog_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

Variable meanings:

- `PORT`: HTTP port used by the Express server
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign and verify JWTs
- `JWT_EXPIRES_IN`: token lifetime, defaulting to `7d` if omitted

Optional variables for the admin seed script:

- `ADMIN_NAME`: display name for the seeded admin, default `Admin User`
- `ADMIN_EMAIL`: admin email to create or update, default `admin@example.com`
- `ADMIN_PASSWORD`: required password for the seeded admin user

## Installation

```bash
npm install
```

## Running the Project

Use the package scripts in [package.json](/c:/Users/joe/Desktop/level%202%20task/product-api/package.json):

Use the package scripts in [package.json](package.json):

```bash
npm start
```

For development with file watching:

```bash
npm run dev
```

The server starts on `http://localhost:<PORT>`. If `PORT` is not set, the code defaults to `5000`.

To seed or update an admin user:

```bash
npm run seed:admin
```

## Database Connection

MongoDB is initialized in [src/config/db.js](src/config/db.js) using `mongoose.connect(process.env.MONGO_URI)`.

If the connection fails, the process exits immediately.

## Authentication and Authorization

### JWT Authentication

Protected routes expect this header:

```http
Authorization: Bearer <token>
```

The auth middleware in [src/middleware/authMiddleware.js](src/middleware/authMiddleware.js) will:

- extract the bearer token
- verify it with `JWT_SECRET`
- load the current user
- attach the user object to `req.user`

If the token is missing, invalid, expired, or the user no longer exists, the API returns `401`.

### Role Authorization

The role middleware in [src/middleware/roleMiddleware.js](src/middleware/roleMiddleware.js) restricts certain actions to allowed roles.

Current behavior:

- product reads require an authenticated user
- product create, update, and delete require role `admin`

## API Base URL

```text
http://localhost:<PORT>
```

When `PORT` is omitted, the API listens on `http://localhost:5000`.

## Available Routes

### Health Check

#### `GET /`

Returns a simple service status response.

Example response:

```json
{
  "success": true,
  "message": "Product Catalog API is running"
}
```

### Product Routes

Defined in [src/routes/productRoutes.js](src/routes/productRoutes.js).

| Method | Endpoint              | Access             | Description           |
| ------ | --------------------- | ------------------ | --------------------- |
| GET    | `/api/products`     | Authenticated user | Get all products      |
| GET    | `/api/products/:id` | Authenticated user | Get one product by id |
| POST   | `/api/products`     | Admin only         | Create a product      |
| PUT    | `/api/products/:id` | Admin only         | Update a product      |
| DELETE | `/api/products/:id` | Admin only         | Delete a product      |

#### `GET /api/products`

Returns all products, populated with creator information and sorted by newest first.

Example response:

```json
{
  "success": true,
  "count": 1,
  "products": [
    {
      "_id": "665000000000000000000001",
      "name": "Wireless Mouse",
      "description": "Ergonomic Bluetooth mouse",
      "category": "Accessories",
      "price": 29.99,
      "stock": 50,
      "createdBy": {
        "_id": "665000000000000000000010",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
      },
      "createdAt": "2026-05-27T10:00:00.000Z",
      "updatedAt": "2026-05-27T10:00:00.000Z"
    }
  ]
}
```

#### `GET /api/products/:id`

Returns one product by MongoDB id.

If the product does not exist, the service returns `404` with `Product not found`.

#### `POST /api/products`

Requires an admin token.

Request body:

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic Bluetooth mouse",
  "category": "Accessories",
  "price": 29.99,
  "stock": 50
}
```

Required fields:

- `name`
- `description`
- `category`
- `price`

Optional field:

- `stock` defaults to `0`

Example response:

```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "665000000000000000000001",
    "name": "Wireless Mouse",
    "description": "Ergonomic Bluetooth mouse",
    "category": "Accessories",
    "price": 29.99,
    "stock": 50,
    "createdBy": "665000000000000000000010",
    "createdAt": "2026-05-27T10:00:00.000Z",
    "updatedAt": "2026-05-27T10:00:00.000Z"
  }
}
```

#### `PUT /api/products/:id`

Requires an admin token.

Accepts partial update fields and runs Mongoose validators.

#### `DELETE /api/products/:id`

Requires an admin token.

Example response:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Authentication Routes

Authentication routes are defined in [src/routes/authRoutes.js](src/routes/authRoutes.js).

| Method | Endpoint               | Access | Description                          |
| ------ | ---------------------- | ------ | ------------------------------------ |
| POST   | `/api/auth/register` | Public | Register a new user                  |
| POST   | `/api/auth/login`    | Public | Authenticate a user and return a JWT |

Authentication business logic exists in:

- [src/controllers/authController.js](src/controllers/authController.js)
- [src/services/authService.js](src/services/authService.js)

Current auth behavior:

- register a user with `name`, `email`, `password`, and optional `role`
- log in with `email` and `password`
- return a signed JWT and basic user details

#### `POST /api/auth/register`

Request body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### `POST /api/auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Expected response shape after successful registration or login:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "id": "665000000000000000000010",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Product Data Model

Defined in [src/models/Product.js](src/models/Product.js).

Fields:

- `name`: string, required, trimmed, indexed
- `description`: string, required
- `category`: string, required, indexed
- `price`: number, required, minimum `0`
- `stock`: number, required, default `0`, minimum `0`
- `createdBy`: ObjectId reference to `User`, required
- `createdAt` and `updatedAt`: provided by timestamps

Indexes:

- index on `name`
- index on `category`
- text index on `name` and `category`

## User Data Model

Defined in [src/models/User.js](src/models/User.js).

Fields:

- `name`: string, required, trimmed
- `email`: string, required, unique, lowercase, trimmed
- `password`: string, required, minimum 6 characters, excluded from queries by default
- `role`: string, enum of `user` or `admin`, defaults to `user`
- `createdAt` and `updatedAt`: provided by timestamps

Behavior:

- passwords are hashed before save with `bcryptjs`
- password verification is available through `comparePassword()`

## Example cURL Requests

### Get all products

```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create a product as admin

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic Bluetooth mouse",
    "category": "Accessories",
    "price": 29.99,
    "stock": 50
  }'
```

## Error Handling

The controllers return JSON error responses in this shape:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common status codes used by the current code:

- `200` for successful fetch, update, delete, and login
- `201` for successful creation and registration
- `401` for missing or invalid credentials/token
- `403` for insufficient role permissions
- `404` for missing product records
- `409` for duplicate user registration
- `500` for unhandled server-side failures
