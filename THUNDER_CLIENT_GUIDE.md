# Thunder Client API Testing Guide

This guide will help you test all API routes using Thunder Client (VS Code extension).

## 📋 Table of Contents

1. [Setup](#setup)
2. [Authentication Routes](#authentication-routes)
3. [User Routes](#user-routes)
4. [Admin Routes](#admin-routes)
5. [Seller Routes](#seller-routes)
6. [Customer Routes](#customer-routes)
7. [Deliverer Routes](#deliverer-routes)
8. [Order Routes](#order-routes)
9. [Product Routes](#product-routes)
10. [Delivery Routes](#delivery-routes)
11. [Payment Routes](#payment-routes)

---

## Setup

### 1. Install Thunder Client

- Open VS Code
- Go to Extensions (Ctrl+Shift+X)
- Search for "Thunder Client"
- Install the extension

### 2. Configure Base URL

- Base URL: `http://localhost:PORT` (replace PORT with your server port, e.g., 3000, 5000)
- Example: `http://localhost:5000`

### 3. Environment Variables (Optional)

Create a Thunder Client environment with:

- `baseUrl`: `http://localhost:5000`
- `token`: (will be set after login)

---

## Authentication Routes

### Base URL: `/api/auth`

#### 1. Register Customer

```
POST {{baseUrl}}/api/auth/register/customer
Content-Type: application/json

{
  "name": "John Doe",
  "email": "customer@example.com",
  "password": "password123",
  "phone_no": "1234567890",
  "address": "123 Main St"
}
```

#### 2. Login Customer

```
POST {{baseUrl}}/api/auth/login/customer
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response:** Copy the `token` from the response. You'll need it for protected routes.

#### 3. Register Seller

```
POST {{baseUrl}}/api/auth/register/seller
Content-Type: application/json

{
  "name": "Jane Seller",
  "shopName": "Jane's Shop",
  "email": "seller@example.com",
  "password": "password123",
  "phone_no": "1234567890",
  "address": "456 Market St"
}
```

#### 4. Login Seller (Only if approved by admin)

```
POST {{baseUrl}}/api/auth/login/seller
Content-Type: application/json

{
  "email": "seller@example.com",
  "password": "password123"
}
```

#### 5. Register Admin

```
POST {{baseUrl}}/api/auth/register/admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### 6. Login Admin

```
POST {{baseUrl}}/api/auth/login/admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### 7. Get Current User (Protected)

```
GET {{baseUrl}}/api/auth/me
Authorization: Bearer {{token}}
```

#### 8. Logout (Protected)

```
POST {{baseUrl}}/api/auth/logout
Authorization: Bearer {{token}}
```

#### 9. Get Pending Sellers (Admin Only)

```
GET {{baseUrl}}/api/auth/sellers/pending
Authorization: Bearer {{adminToken}}
```

#### 10. Approve Seller (Admin Only)

```
PUT {{baseUrl}}/api/auth/seller/approve/:id
Authorization: Bearer {{adminToken}}
```

Replace `:id` with the seller's ID.

#### 11. Reject Seller (Admin Only)

```
PUT {{baseUrl}}/api/auth/seller/reject/:id
Authorization: Bearer {{adminToken}}
```

---

## User Routes

### Base URL: `/api/users`

**All routes require Admin authentication**

#### 1. Get All Users

```
GET {{baseUrl}}/api/users?page=1&limit=10
Authorization: Bearer {{adminToken}}
```

#### 2. Get User by ID

```
GET {{baseUrl}}/api/users/:id
Authorization: Bearer {{adminToken}}
```

#### 3. Create User

```
POST {{baseUrl}}/api/users
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### 4. Update User

```
PUT {{baseUrl}}/api/users/:id
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin",
  "isActive": true
}
```

#### 5. Delete User

```
DELETE {{baseUrl}}/api/users/:id
Authorization: Bearer {{adminToken}}
```

---

## Admin Routes

### Base URL: `/api/admin`

**All routes require Admin authentication**

#### 1. Get Pending Sellers

```
GET {{baseUrl}}/api/admin/sellers/pending
Authorization: Bearer {{adminToken}}
```

#### 2. Approve Seller

```
PUT {{baseUrl}}/api/admin/sellers/approve/:id
Authorization: Bearer {{adminToken}}
```

#### 3. Reject Seller

```
PUT {{baseUrl}}/api/admin/sellers/reject/:id
Authorization: Bearer {{adminToken}}
```

#### 4. Approve Customer

```
PUT {{baseUrl}}/api/admin/customers/approve/:id
Authorization: Bearer {{adminToken}}
```

#### 5. Approve Deliverer

```
PUT {{baseUrl}}/api/admin/deliverers/approve/:id
Authorization: Bearer {{adminToken}}
```

---

## Seller Routes

### Base URL: `/api/sellers`

**All routes require Seller or Admin authentication**

#### 1. Get All Sellers (Admin sees all, Seller sees only their profile)

```
GET {{baseUrl}}/api/sellers?page=1&limit=10
Authorization: Bearer {{sellerToken}}
```

#### 2. Get Seller by ID

```
GET {{baseUrl}}/api/sellers/:id
Authorization: Bearer {{sellerToken}}
```

#### 3. Update Seller

```
PUT {{baseUrl}}/api/sellers/:id
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "name": "Updated Name",
  "shopName": "Updated Shop",
  "phone_no": "9876543210",
  "address": "New Address"
}
```

#### 4. Delete Seller (Admin Only)

```
DELETE {{baseUrl}}/api/sellers/:id
Authorization: Bearer {{adminToken}}
```

---

## Customer Routes

### Base URL: `/api/customers`

**All routes require Customer or Admin authentication**

#### 1. Get All Customers (Admin sees all, Customer sees only their profile)

```
GET {{baseUrl}}/api/customers?page=1&limit=10
Authorization: Bearer {{customerToken}}
```

#### 2. Get Customer by ID

```
GET {{baseUrl}}/api/customers/:id
Authorization: Bearer {{customerToken}}
```

#### 3. Update Customer

```
PUT {{baseUrl}}/api/customers/:id
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone_no": "9876543210",
  "address": "New Address"
}
```

#### 4. Delete Customer (Admin Only)

```
DELETE {{baseUrl}}/api/customers/:id
Authorization: Bearer {{adminToken}}
```

---

## Deliverer Routes

### Base URL: `/api/deliverers`

**All routes require Admin authentication**

#### 1. Get All Deliverers

```
GET {{baseUrl}}/api/deliverers?page=1&limit=10
Authorization: Bearer {{adminToken}}
```

#### 2. Get Deliverer by ID

```
GET {{baseUrl}}/api/deliverers/:id
Authorization: Bearer {{adminToken}}
```

#### 3. Create Deliverer

```
POST {{baseUrl}}/api/deliverers
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Delivery Person",
  "phone_no": "1234567890",
  "email": "deliverer@example.com",
  "vehicle_no": "ABC123",
  "vehicle_type": "Motorcycle",
  "address": "789 Delivery St"
}
```

#### 4. Update Deliverer

```
PUT {{baseUrl}}/api/deliverers/:id
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone_no": "9876543210"
}
```

#### 5. Delete Deliverer

```
DELETE {{baseUrl}}/api/deliverers/:id
Authorization: Bearer {{adminToken}}
```

---

## Order Routes

### Base URL: `/api/orders`

**All routes require authentication**

#### 1. Get All Orders

- **Customer**: Sees only their orders
- **Seller**: Sees orders for their products
- **Admin**: Sees all orders

```
GET {{baseUrl}}/api/orders?page=1&limit=10
Authorization: Bearer {{customerToken}}
```

#### 2. Get Order by ID

```
GET {{baseUrl}}/api/orders/:id
Authorization: Bearer {{customerToken}}
```

#### 3. Create Order (Customer Only)

```
POST {{baseUrl}}/api/orders
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "product_id": "product_id_here",
  "quantity": 2
}
```

#### 4. Update Order (Seller or Admin)

```
PUT {{baseUrl}}/api/orders/:id
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### 5. Delete Order (Admin Only)

```
DELETE {{baseUrl}}/api/orders/:id
Authorization: Bearer {{adminToken}}
```

---

## Product Routes

### Base URL: `/api/products`

**View routes are public, modify routes require authentication**

#### 1. Get All Products (Public - Optional auth for sellers to filter their products)

```
GET {{baseUrl}}/api/products?page=1&limit=10&name=product_name
```

#### 2. Get Product by ID (Public)

```
GET {{baseUrl}}/api/products/:id
```

#### 3. Create Product (Seller Only)

```
POST {{baseUrl}}/api/products
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "name": "Product Name",
  "price": 99.99,
  "instock": true,
  "discount": 10,
  "description": "Product description"
}
```

#### 4. Update Product (Seller or Admin)

```
PUT {{baseUrl}}/api/products/:id
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99,
  "instock": true,
  "discount": 15
}
```

#### 5. Delete Product (Seller or Admin)

```
DELETE {{baseUrl}}/api/products/:id
Authorization: Bearer {{sellerToken}}
```

---

## Delivery Routes

### Base URL: `/api/deliveries`

**All routes require authentication**

#### 1. Get All Deliveries

```
GET {{baseUrl}}/api/deliveries?page=1&limit=10&status=pending
Authorization: Bearer {{adminToken}}
```

#### 2. Get Delivery by ID

```
GET {{baseUrl}}/api/deliveries/:id
Authorization: Bearer {{adminToken}}
```

#### 3. Create Delivery (Admin Only)

```
POST {{baseUrl}}/api/deliveries
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "address": "123 Delivery Address",
  "order_id": "order_id_here",
  "deliverer_id": "deliverer_id_here",
  "status": "pending"
}
```

#### 4. Update Delivery Status

```
PUT {{baseUrl}}/api/deliveries/:id
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "in_transit",
  "deliverer_id": "deliverer_id_here"
}
```

#### 5. Delete Delivery (Admin Only)

```
DELETE {{baseUrl}}/api/deliveries/:id
Authorization: Bearer {{adminToken}}
```

---

## Payment Routes

### Base URL: `/api/payments`

**All routes require authentication**

#### 1. Get All Payments

- **Customer**: Sees only their payments
- **Admin**: Sees all payments

```
GET {{baseUrl}}/api/payments?page=1&limit=10
Authorization: Bearer {{customerToken}}
```

#### 2. Get Payment by ID

```
GET {{baseUrl}}/api/payments/:id
Authorization: Bearer {{customerToken}}
```

#### 3. Create Payment (Customer Only)

```
POST {{baseUrl}}/api/payments
Authorization: Bearer {{customerToken}}
Content-Type: application/json

{
  "order_id": "order_id_here",
  "payment_method": "credit_card"
}
```

**Payment Methods:** `cash`, `credit_card`, `online`, `upi`

#### 4. Update Payment (Admin Only)

```
PUT {{baseUrl}}/api/payments/:id
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "payment_method": "online"
}
```

#### 5. Delete Payment (Admin Only)

```
DELETE {{baseUrl}}/api/payments/:id
Authorization: Bearer {{adminToken}}
```

---

## 🔑 How to Use Tokens in Thunder Client

### Method 1: Using Authorization Header

1. After logging in, copy the `token` from the response
2. In Thunder Client, go to the **Auth** tab
3. Select **Bearer Token**
4. Paste your token

### Method 2: Using Variables

1. Create an environment variable `token`
2. In the request header, add:
   ```
   Authorization: Bearer {{token}}
   ```
3. Set the token value after login

### Method 3: Manual Header

1. Add a header:
   - Key: `Authorization`
   - Value: `Bearer your_token_here`

---

## 📝 Testing Workflow Example

### Step 1: Register and Login as Admin

```
POST /api/auth/register/admin
POST /api/auth/login/admin
→ Copy the token
```

### Step 2: Approve a Seller

```
GET /api/auth/sellers/pending
→ Get seller ID
PUT /api/auth/seller/approve/:id
```

### Step 3: Login as Seller

```
POST /api/auth/login/seller
→ Copy the seller token
```

### Step 4: Create a Product (as Seller)

```
POST /api/products
Authorization: Bearer {{sellerToken}}
→ Copy the product ID
```

### Step 5: Login as Customer

```
POST /api/auth/login/customer
→ Copy the customer token
```

### Step 6: Create an Order (as Customer)

```
POST /api/orders
Authorization: Bearer {{customerToken}}
Body: { "product_id": "...", "quantity": 2 }
→ Copy the order ID
```

### Step 7: Create Payment (as Customer)

```
POST /api/payments
Authorization: Bearer {{customerToken}}
Body: { "order_id": "...", "payment_method": "credit_card" }
```

### Step 8: Create Delivery (as Admin)

```
POST /api/deliveries
Authorization: Bearer {{adminToken}}
Body: { "address": "...", "order_id": "...", "deliverer_id": "..." }
```

---

## 🚨 Common Issues

### 1. "Not authorized to access this route"

- **Solution**: Make sure you're using the correct token and role
- Check if the token is expired or blacklisted (if you logged out)

### 2. "Token has been invalidated"

- **Solution**: You logged out. Login again to get a new token

### 3. "Seller account is pending approval"

- **Solution**: Admin needs to approve the seller first
- Use: `PUT /api/auth/seller/approve/:id` as admin

### 4. "Invalid token"

- **Solution**: Check if the token is correctly formatted
- Format: `Bearer your_token_here`
- Make sure there's a space between "Bearer" and the token

### 5. 404 Not Found

- **Solution**: Check the route path and HTTP method
- Make sure the server is running
- Verify the base URL is correct

---

## 💡 Tips

1. **Save Requests**: Create collections in Thunder Client to organize your requests
2. **Use Environments**: Set up different environments for dev/staging/production
3. **Test Token Expiry**: Tokens expire after the set time (default: 30 days)
4. **Check Response Status**: Always check the status code (200, 201, 400, 401, 403, 404)
5. **Read Error Messages**: The API returns helpful error messages in the response

---

## 📚 Quick Reference

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Roles

- `admin` - Full access
- `seller` - Manage products and orders
- `customer` - View products, place orders, make payments

### Common Headers

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

Happy Testing! 🚀

