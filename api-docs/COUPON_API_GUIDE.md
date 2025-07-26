# Coupon Management API Guide

This guide provides detailed information about the Coupon Management API endpoints, data models, and usage examples.

## Table of Contents
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Examples](#examples)
- [Error Handling](#error-handling)

## Data Model

### Coupon Schema

| Field          | Type     | Description                                    | Required | Default |
|----------------|----------|------------------------------------------------|----------|---------|
| code           | String   | Unique coupon code (automatically uppercase)    | Yes      | -       |
| discountType   | String   | Either 'percentage' or 'fixed'                 | Yes      | -       |
| discountValue  | Number   | Discount amount or percentage                  | Yes      | -       |
| minPurchase    | Number   | Minimum purchase amount required               | Yes      | 0       |
| expirationDate | Date     | When the coupon expires                       | Yes      | -       |
| status         | String   | 'active', 'expired', or 'inactive'            | Yes      | active  |
| createdAt      | Date     | Timestamp of creation                         | Auto     | Now     |
| updatedAt      | Date     | Timestamp of last update                      | Auto     | Now     |

## API Endpoints

### Admin Routes (Protected)

#### Create Coupon
- **POST** `/api/coupons`
- **Auth Required**: Yes (Admin only)
- **Body**:
```json
{
  "code": "SUMMER25",
  "discountType": "percentage",
  "discountValue": 25,
  "minPurchase": 100,
  "expirationDate": "2024-12-31T23:59:59Z",
  "status": "active"
}
```
- **Response** (201):
```json
{
  "success": true,
  "data": {
    "code": "SUMMER25",
    "discountType": "percentage",
    "discountValue": 25,
    "minPurchase": 100,
    "expirationDate": "2024-12-31T23:59:59.000Z",
    "status": "active",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z",
    "_id": "..."
  }
}
```

#### Get All Coupons
- **GET** `/api/coupons`
- **Auth Required**: Yes
- **Response** (200):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "code": "SUMMER25",
      "discountType": "percentage",
      "discountValue": 25,
      // ... other fields
    }
  ]
}
```

#### Get Coupon by ID
- **GET** `/api/coupons/:id`
- **Auth Required**: Yes
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "code": "SUMMER25",
    // ... other fields
  }
}
```

#### Update Coupon
- **PUT** `/api/coupons/:id`
- **Auth Required**: Yes (Admin only)
- **Body**: Same as Create Coupon (fields to update)
- **Response** (200):
```json
{
  "success": true,
  "data": {
    // Updated coupon data
  }
}
```

#### Delete Coupon
- **DELETE** `/api/coupons/:id`
- **Auth Required**: Yes (Admin only)
- **Response** (200):
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

### Public Routes

#### Validate Coupon
- **POST** `/api/coupons/validate`
- **Auth Required**: No
- **Body**:
```json
{
  "code": "SUMMER25",
  "purchaseAmount": 100
}
```
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "coupon": {
      "code": "SUMMER25",
      "discountType": "percentage",
      "discountValue": 25,
      // ... other coupon fields
    },
    "discountAmount": 25,
    "finalAmount": 75
  }
}
```

## Authentication

The API uses JWT (JSON Web Token) authentication. For protected routes:
1. Include the JWT token in the Authorization header
2. Format: `Bearer <your-token>`

Example:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Examples

### Creating a Fixed Amount Coupon

```json
POST /api/coupons
{
  "code": "SAVE10",
  "discountType": "fixed",
  "discountValue": 10,
  "minPurchase": 50,
  "expirationDate": "2024-12-31T23:59:59Z"
}
```

### Creating a Percentage Discount Coupon

```json
POST /api/coupons
{
  "code": "SPRING30",
  "discountType": "percentage",
  "discountValue": 30,
  "minPurchase": 150,
  "expirationDate": "2024-06-30T23:59:59Z"
}
```

### Validating a Coupon

```json
POST /api/coupons/validate
{
  "code": "SPRING30",
  "purchaseAmount": 200
}
```

Response:
```json
{
  "success": true,
  "data": {
    "coupon": {
      "code": "SPRING30",
      "discountType": "percentage",
      "discountValue": 30
    },
    "discountAmount": 60,
    "finalAmount": 140
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### Common Error Responses

#### Invalid Coupon Code (400)
```json
{
  "success": false,
  "message": "Invalid or expired coupon code"
}
```

#### Minimum Purchase Not Met (400)
```json
{
  "success": false,
  "message": "Minimum purchase amount of 100 required"
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

#### Authorization Error (403)
```json
{
  "success": false,
  "message": "User role is not authorized to access this route"
}
```

#### Not Found (404)
```json
{
  "success": false,
  "message": "Coupon not found"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "message": "Error processing request",
  "error": "Error details..."
}
``` 