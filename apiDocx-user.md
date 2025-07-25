# 👤 User API Documentation

## Overview

This documentation covers the APIs for normal users (customers) in the e-commerce system, including authentication, product browsing, cart management, and order placement.

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "type": "customer",
    "isEmailVerified": false
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (if email not verified):**
```json
{
  "message": "Please verify your email address before logging in. Check your inbox for the verification link."
}
```

**Response (if email verified):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "type": "customer",
    "isEmailVerified": true,
    "token": "jwt_token_here"
  }
}
```

### Verify Email
```http
GET /api/auth/verify-email?token=verification_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now log in to your account."
}
```

### Resend Verification Email
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent successfully! Please check your inbox."
}
```

## 📧 Email Verification System

### How Email Verification Works

1. **Registration Process:**
   - User registers with email and password
   - System generates a unique verification token (valid for 24 hours)
   - Verification email is sent to user's email address
   - User account is created but marked as unverified
   - User cannot login until email is verified

2. **Email Verification:**
   - User receives email with verification link
   - Link contains unique token: `http://localhost:3000/verify-email?token=abc123...`
   - User clicks link or visits verification endpoint
   - System validates token and marks email as verified
   - User can now login successfully

3. **Resend Verification:**
   - If user doesn't receive email or token expires
   - User can request new verification email
   - New token is generated and sent
   - Previous token becomes invalid

### Email Verification Requirements

**Environment Variables Required:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Gmail Setup Instructions:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate new app password for "Mail"
3. Use the app password as `EMAIL_PASS`

### Email Verification Flow Diagram

```
User Registration
       ↓
Generate Verification Token
       ↓
Send Verification Email
       ↓
User Clicks Email Link
       ↓
Validate Token
       ↓
Mark Email as Verified
       ↓
User Can Login
```

### Error Responses

**Token Expired:**
```json
{
  "message": "Invalid or expired verification token"
}
```

**Invalid Token:**
```json
{
  "message": "Invalid or expired verification token"
}
```

**Email Already Verified:**
```json
{
  "message": "Email is already verified"
}
```

**User Not Found (Resend):**
```json
{
  "message": "User not found"
}
```

### Frontend Integration Tips

1. **Registration Success:**
   - Show success message with email verification instruction
   - Provide option to resend verification email
   - Don't automatically log user in

2. **Login Attempt:**
   - Check if email is verified before allowing login
   - Show clear message if email not verified
   - Provide link to resend verification

3. **Email Verification Page:**
   - Extract token from URL query parameter
   - Call verification API endpoint
   - Show success/error message
   - Redirect to login page on success

4. **Resend Verification:**
   - Provide form to enter email address
   - Show loading state during API call
   - Display success/error messages

### Security Features

- ✅ **24-hour token expiry** - Tokens expire after 24 hours
- ✅ **Unique tokens** - Each token is cryptographically secure
- ✅ **One-time use** - Tokens become invalid after verification
- ✅ **Email validation** - Only verified emails can login
- ✅ **Rate limiting** - Prevents abuse of resend functionality

### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "type": "customer",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    }
  }
}
```

## 🏪 Company Setup

### Get Current Company
```http
GET /api/companies/current
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "company_id",
    "name": "Store Name",
    "address": {
      "street": "123 Store St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "phone": "+1234567890",
    "email": "store@example.com",
    "website": "https://store.com",
    "logo": "logo_url",
    "taxId": "TAX123456",
    "registrationNumber": "REG123456",
    "location": "New York",
    "owner": "user_id"
  }
}
```

## 📦 Products

### Get All Products
```http
GET /api/products?page=1&limit=10&category=category_id
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category ID

**Response:**
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "images": ["image1.jpg", "image2.jpg"],
      "stock": 100,
      "slug": "product-name",
      "category": {
        "_id": "category_id",
        "name": "Category Name"
      },
      "brand": {
        "_id": "brand_id",
        "name": "Brand Name"
      },
      "color": {
        "_id": "color_id",
        "name": "Red",
        "hexCode": "#FF0000"
      },
      "size": {
        "_id": "size_id",
        "name": "Large"
      },
      "variants": [
        {
          "variantId": {
            "_id": "variant_id",
            "name": "Size",
            "values": ["S", "M", "L", "XL"]
          },
          "value": "L"
        }
      ],
      "companyId": "company_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pages": 5,
  "total": 50
}
```

### Get Single Product
```http
GET /api/products/:id
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
{
  "_id": "product_id",
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "images": ["image1.jpg", "image2.jpg"],
  "stock": 100,
  "slug": "product-name",
  "category": {
    "_id": "category_id",
    "name": "Category Name"
  },
  "brand": {
    "_id": "brand_id",
    "name": "Brand Name"
  },
  "color": {
    "_id": "color_id",
    "name": "Red",
    "hexCode": "#FF0000"
  },
  "size": {
    "_id": "size_id",
    "name": "Large"
  },
  "variants": [
    {
      "variantId": {
        "_id": "variant_id",
        "name": "Size",
        "values": ["S", "M", "L", "XL"]
      },
      "value": "L"
    }
  ],
  "companyId": "company_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Categories
```http
GET /api/categories
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
[
  {
    "_id": "category_id",
    "name": "Electronics",
    "description": "Electronic products",
    "slug": "electronics",
    "status": "active",
    "companyId": "company_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Brands
```http
GET /api/brands
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
[
  {
    "_id": "brand_id",
    "name": "Apple",
    "description": "Apple products",
    "companyId": "company_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Colors
```http
GET /api/colors
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
[
  {
    "_id": "color_id",
    "name": "Red",
    "hexCode": "#FF0000",
    "description": "Bright red color",
    "isActive": true,
    "companyId": "company_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Sizes
```http
GET /api/sizes
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
[
  {
    "_id": "size_id",
    "name": "Large",
    "description": "Large size",
    "isActive": true,
    "companyId": "company_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🛒 Cart Management

### Add Item to Cart
```http
POST /api/cart
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}
```

**Response:**
```json
{
  "_id": "cart_item_id",
  "companyId": "company_id",
  "productId": {
    "_id": "product_id",
    "name": "Product Name",
    "price": 29.99,
    "images": ["image1.jpg"]
  },
  "quantity": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Cart Items
```http
GET /api/cart
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
[
  {
    "_id": "cart_item_id",
    "companyId": "company_id",
    "productId": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 29.99,
      "images": ["image1.jpg"],
      "stock": 100
    },
    "quantity": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Cart Item
```http
PUT /api/cart
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 3
}
```

**Response:**
```json
{
  "_id": "cart_item_id",
  "companyId": "company_id",
  "productId": "product_id",
  "quantity": 3,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Remove Item from Cart
```http
DELETE /api/cart
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
Content-Type: application/json

{
  "productId": "product_id"
}
```

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

## 📋 Orders

### Create Order
```http
POST /api/orders
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "product_id",
      "name": "Product Name",
      "quantity": 2,
      "price": 29.99,
      "image": "image1.jpg"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "PayPal",
  "taxPrice": 2.99,
  "shippingPrice": 5.99,
  "totalPrice": 68.96
}
```

**Response:**
```json
{
  "_id": "order_id",
  "companyId": "company_id",
  "orderItems": [
    {
      "product": "product_id",
      "name": "Product Name",
      "quantity": 2,
      "price": 29.99,
      "image": "image1.jpg"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "PayPal",
  "taxPrice": 2.99,
  "shippingPrice": 5.99,
  "totalPrice": 68.96,
  "isPaid": false,
  "isDelivered": false,
  "status": "pending",
  "orderNumber": "ORD2401010001",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Orders
```http
GET /api/orders?page=1&status=pending
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `status` (optional): Filter by status (pending, processing, shipped, delivered, cancelled)

**Response:**
```json
{
  "orders": [
    {
      "_id": "order_id",
      "companyId": "company_id",
      "orderItems": [
        {
          "product": {
            "_id": "product_id",
            "name": "Product Name",
            "images": ["image1.jpg"]
          },
          "name": "Product Name",
          "quantity": 2,
          "price": 29.99,
          "image": "image1.jpg"
        }
      ],
      "shippingAddress": {
        "address": "123 Main St",
        "city": "New York",
        "postalCode": "10001",
        "country": "USA",
        "phone": "+1234567890"
      },
      "paymentMethod": "PayPal",
      "taxPrice": 2.99,
      "shippingPrice": 5.99,
      "totalPrice": 68.96,
      "isPaid": false,
      "isDelivered": false,
      "status": "pending",
      "orderNumber": "ORD2401010001",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pages": 3,
  "total": 25
}
```

### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
```

**Response:**
```json
{
  "_id": "order_id",
  "companyId": "company_id",
  "orderItems": [
    {
      "product": {
        "_id": "product_id",
        "name": "Product Name",
        "images": ["image1.jpg"],
        "price": 29.99
      },
      "name": "Product Name",
      "quantity": 2,
      "price": 29.99,
      "image": "image1.jpg"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "PayPal",
  "paymentResult": {
    "id": "payment_id",
    "status": "completed",
    "update_time": "2024-01-01T00:00:00.000Z",
    "email_address": "john@example.com"
  },
  "taxPrice": 2.99,
  "shippingPrice": 5.99,
  "totalPrice": 68.96,
  "isPaid": true,
  "paidAt": "2024-01-01T00:00:00.000Z",
  "isDelivered": false,
  "status": "processing",
  "orderNumber": "ORD2401010001",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Order to Paid
```http
PUT /api/orders/:id/pay
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: COMPANY_ID
Content-Type: application/json

{
  "paymentResult": {
    "id": "payment_id",
    "status": "completed",
    "update_time": "2024-01-01T00:00:00.000Z",
    "email_address": "john@example.com"
  }
}
```

**Response:**
```json
{
  "_id": "order_id",
  "companyId": "company_id",
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "PayPal",
  "paymentResult": {
    "id": "payment_id",
    "status": "completed",
    "update_time": "2024-01-01T00:00:00.000Z",
    "email_address": "john@example.com"
  },
  "taxPrice": 2.99,
  "shippingPrice": 5.99,
  "totalPrice": 68.96,
  "isPaid": true,
  "paidAt": "2024-01-01T00:00:00.000Z",
  "isDelivered": false,
  "status": "processing",
  "orderNumber": "ORD2401010001",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 👤 User Profile Management

### Get User Profile
```http
GET /api/users/profile/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "type": "customer",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile
```http
PUT /api/users/profile/me
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak St",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90210",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "user",
    "type": "customer",
    "phone": "+1234567890",
    "address": {
      "street": "456 Oak St",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90210",
      "country": "USA"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🚨 Error Responses

### Authentication Error
```json
{
  "message": "User not authenticated"
}
```

### Missing Company ID
```json
{
  "message": "Missing x-company-id header"
}
```

### Not Found Error
```json
{
  "message": "Product not found"
}
```

### Validation Error
```json
{
  "message": "Please add a product name"
}
```

### Duplicate Entry Error
```json
{
  "message": "Duplicate entry: name already exists for this company."
}
```

### Insufficient Stock Error
```json
{
  "message": "Insufficient stock for product Product Name. Available: 5"
}
```

## 📝 Important Notes

1. **Authentication**: All API calls (except register/login) require a valid JWT token in the Authorization header.
2. **Company ID**: Most API calls require the `x-company-id` header to identify which company's data to access.
3. **Pagination**: List endpoints support pagination with `page` and `limit` parameters.
4. **Stock Validation**: Orders will fail if products don't have sufficient stock.
5. **Order Status**: Orders progress through: pending → processing → shipped → delivered (or cancelled).
6. **Payment**: Orders can be marked as paid using the `/pay` endpoint after payment processing.

## 🔧 Frontend Integration Tips

1. **Store JWT Token**: Save the token from login/register in localStorage or secure storage.
2. **Company Context**: Store the company ID in your app's context/state management.
3. **Error Handling**: Always handle the various error responses gracefully.
4. **Loading States**: Show loading indicators during API calls.
5. **Form Validation**: Validate forms on the frontend before submitting to API.
6. **Real-time Updates**: Consider implementing WebSocket connections for order status updates.

---

**Base URL**: `http://localhost:3000` (or your server URL)  
**API Version**: v1  
**Content-Type**: `application/json` (for POST/PUT requests) 