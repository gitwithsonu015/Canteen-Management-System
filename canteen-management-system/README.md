# Canteen Management System

A full-stack canteen ordering and admin management application built with Next.js App Router, React, Tailwind CSS v4, and MongoDB.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion + Lucide icons
- MongoDB + Mongoose
- JWT auth (`Authorization: Bearer <token>`)

## Features

- User authentication (register/login)
- Browse menu and view food details
- Cart and checkout flow
- User order history and dashboard
- Admin panel for dashboard, menu management, and order updates
- Admin-only API authorization using JWT role checks

## Project Setup

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Create `.env.local` in the project root:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/canteen-management-system
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Environment variable reference:

- `MONGODB_URI`: Mongo connection string
- `JWT_SECRET`: secret used to sign/verify JWT
- `JWT_EXPIRES_IN`: token expiry duration
- `NEXT_PUBLIC_API_BASE_URL`: base URL used by frontend service layer

## 3) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`: start development server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: lint project

## Authentication and Roles

- JWT payload includes `userId` and `role`.
- Role values: `admin`, `user`.
- Admin-protected endpoints return `403 Forbidden` if token role is not `admin`.

Important behavior:

- Register API creates users with `role: "user"` by default.
- To use admin APIs, promote a user to `admin` in MongoDB and log in again to mint a fresh token.

## Frontend App Routes

Public/User routes:

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/menu` - Menu listing
- `/menu/[id]` - Food details
- `/cart` - Cart
- `/checkout` - Checkout
- `/orders` - User orders
- `/dashboard` - User dashboard

Admin routes:

- `/admin` - Entry redirect route
	- Unauthenticated -> `/admin/login`
	- Authenticated non-admin -> `/dashboard`
	- Authenticated admin -> `/admin/dashboard`
- `/admin/login` - Admin login UI
- `/admin/dashboard` - Admin dashboard
- `/admin/menu` - Admin menu management
- `/admin/orders` - Admin order management
- `/admin/users` - Admin users page UI
- `/admin/settings` - Admin settings UI

## API Endpoints

All APIs are under `/api`.

## Auth

### `POST /api/auth/register`

Creates a new user account.

Request body:

```json
{
	"name": "User Name",
	"email": "user@example.com",
	"password": "password123"
}
```

Responses:

- `201`: registered, returns `{ token, user }`
- `400`: missing required fields
- `409`: email already exists
- `503`: database connectivity issue

### `POST /api/auth/login`

Authenticates a user and returns JWT.

Request body:

```json
{
	"email": "user@example.com",
	"password": "password123"
}
```

Responses:

- `200`: success, returns `{ token, user }`
- `400`: missing required fields
- `401`: invalid credentials

## Menu

### `GET /api/menu`

Fetch all food items.

Responses:

- `200`: success

### `POST /api/menu` (Admin only)

Create a menu item.

Headers:

- `Authorization: Bearer <token>`

Request body:

```json
{
	"name": "Paneer Wrap",
	"price": 120,
	"category": "Main Course",
	"image": "",
	"available": true
}
```

Responses:

- `201`: created
- `401`: missing/invalid token
- `403`: non-admin token
- `400`: invalid input

### `PUT /api/menu/:id` (Admin only)

Update a food item by id.

Headers:

- `Authorization: Bearer <token>`

Request body: partial fields from Food model.

Responses:

- `200`: updated
- `401`: missing/invalid token
- `403`: non-admin token
- `404`: food not found

### `DELETE /api/menu/:id` (Admin only)

Delete a food item by id.

Headers:

- `Authorization: Bearer <token>`

Responses:

- `200`: deleted
- `401`: missing/invalid token
- `403`: non-admin token
- `404`: food not found

## Orders

### `GET /api/orders`

Fetch orders:

- admin gets all orders
- user gets only own orders

Headers:

- `Authorization: Bearer <token>`

Responses:

- `200`: success
- `401`: missing/invalid token

### `POST /api/orders`

Create an order for authenticated user.

Headers:

- `Authorization: Bearer <token>`

Request body:

```json
{
	"items": [
		{
			"foodId": "64f...",
			"name": "Veg Biryani",
			"price": 140,
			"quantity": 2
		}
	],
	"totalPrice": 280,
	"paymentStatus": "unpaid"
}
```

Responses:

- `201`: created
- `401`: missing/invalid token
- `400`: invalid payload

### `GET /api/orders/:id`

Get one order by id. Allowed for owner or admin.

Headers:

- `Authorization: Bearer <token>`

Responses:

- `200`: success
- `401`: missing/invalid token
- `403`: not owner and not admin
- `404`: order not found

### `PATCH /api/orders/:id` (Admin only)

Update order status/payment status.

Headers:

- `Authorization: Bearer <token>`

Request body (one or both):

```json
{
	"status": "preparing",
	"paymentStatus": "paid"
}
```

Status enum:

- `pending`
- `preparing`
- `completed`
- `cancelled`

Payment status enum:

- `unpaid`
- `paid`

Responses:

- `200`: updated
- `401`: missing/invalid token
- `403`: non-admin token
- `404`: order not found

## Data Models

## User

- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, min 6, hashed)
- `role` (`admin` | `user`, default `user`)

## Food

- `name` (String, required)
- `price` (Number, required)
- `category` (String, required)
- `image` (String)
- `available` (Boolean, default `true`)

## Order

- `userId` (ObjectId -> User)
- `items[]` with `foodId`, `name`, `price`, `quantity`
- `totalPrice` (Number)
- `status` (`pending` | `preparing` | `completed` | `cancelled`)
- `paymentStatus` (`unpaid` | `paid`)

## Known Gap

- The admin UI page `/admin/users` currently calls `/api/users`, but this endpoint is not implemented yet in `src/app/api`.

## Recommended Next Step

- Add `/api/users` with admin-only access to support the admin users page fully.
