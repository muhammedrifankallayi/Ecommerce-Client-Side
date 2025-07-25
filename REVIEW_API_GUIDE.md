# Product Review API Guide

This guide covers the complete Product Review API implementation with image support, helpful voting, and comprehensive CRUD operations.

## 📋 Overview

The Review API allows users to:
- Create reviews for products with images
- View reviews for specific products
- Update and delete their own reviews
- Mark reviews as helpful/unhelpful
- Get review statistics and pagination

## 🔐 Authentication

All review endpoints require:
- **JWT Token**: `Authorization: Bearer <token>`
- **Company ID**: `x-company-id: <company_id>`

## 📝 API Endpoints

### 1. Create Review
**POST** `/api/reviews`

Create a new review for a product with optional images.

**Headers:**
```http
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: YOUR_COMPANY_ID
Content-Type: multipart/form-data
```

**Form Data:**
- `productId` (required): Product ID
- `rating` (required): Rating from 1-5
- `title` (required): Review title (max 100 chars)
- `comment` (required): Review comment (max 1000 chars)
- `images` (optional): Array of image files (max 5 images)

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-company-id: YOUR_COMPANY_ID" \
  -F "productId=64f8a1b2c3d4e5f6a7b8c9d0" \
  -F "rating=5" \
  -F "title=Excellent Product!" \
  -F "comment=This product exceeded my expectations. Great quality and fast delivery." \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "productId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Classic T-Shirt",
      "images": ["image1.jpg", "image2.jpg"]
    },
    "userId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "John Doe"
    },
    "companyId": "64f8a1b2c3d4e5f6a7b8c9d3",
    "rating": 5,
    "title": "Excellent Product!",
    "comment": "This product exceeded my expectations. Great quality and fast delivery.",
    "images": [
      "uploads/1751387168020-review-image1.jpg",
      "uploads/1751387168021-review-image2.jpg"
    ],
    "isVerified": false,
    "isHelpful": 0,
    "helpfulUsers": [],
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 2. Get Product Reviews
**GET** `/api/reviews/product/:productId`

Get all reviews for a specific product with pagination and statistics.

**Headers:**
```http
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: YOUR_COMPANY_ID
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Reviews per page (default: 10)
- `sort` (optional): Sort order (default: "-createdAt")
  - `-createdAt`: Newest first
  - `-rating`: Highest rating first
  - `-isHelpful`: Most helpful first
  - `createdAt`: Oldest first

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/reviews/product/64f8a1b2c3d4e5f6a7b8c9d0?page=1&limit=5&sort=-rating" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "productId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "Classic T-Shirt",
          "images": ["image1.jpg"]
        },
        "userId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "John Doe"
        },
        "rating": 5,
        "title": "Excellent Product!",
        "comment": "This product exceeded my expectations.",
        "images": ["uploads/review-image1.jpg"],
        "isVerified": false,
        "isHelpful": 3,
        "helpfulUsers": ["64f8a1b2c3d4e5f6a7b8c9d4", "64f8a1b2c3d4e5f6a7b8c9d5"],
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 25,
      "pages": 5
    },
    "stats": {
      "averageRating": 4.2,
      "totalReviews": 25
    }
  }
}
```

### 3. Get Single Review
**GET** `/api/reviews/:id`

Get a specific review by ID.

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/reviews/64f8a1b2c3d4e5f6a7b8c9d1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "productId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Classic T-Shirt",
      "images": ["image1.jpg"]
    },
    "userId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "John Doe"
    },
    "rating": 5,
    "title": "Excellent Product!",
    "comment": "This product exceeded my expectations.",
    "images": ["uploads/review-image1.jpg"],
    "isVerified": false,
    "isHelpful": 3,
    "helpfulUsers": ["64f8a1b2c3d4e5f6a7b8c9d4"],
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 4. Update Review
**PUT** `/api/reviews/:id`

Update a review (only by the review author).

**Headers:**
```http
Authorization: Bearer YOUR_JWT_TOKEN
x-company-id: YOUR_COMPANY_ID
Content-Type: multipart/form-data
```

**Form Data:**
- `rating` (optional): Rating from 1-5
- `title` (optional): Review title (max 100 chars)
- `comment` (optional): Review comment (max 1000 chars)
- `images` (optional): Array of image files (max 5 images)

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/reviews/64f8a1b2c3d4e5f6a7b8c9d1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-company-id: YOUR_COMPANY_ID" \
  -F "rating=4" \
  -F "title=Updated Review Title" \
  -F "comment=Updated review comment with more details." \
  -F "images=@/path/to/new-image.jpg"
```

### 5. Delete Review
**DELETE** `/api/reviews/:id`

Delete a review (only by the review author).

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/reviews/64f8a1b2c3d4e5f6a7b8c9d1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### 6. Mark Review as Helpful
**POST** `/api/reviews/:id/helpful`

Toggle helpful status for a review.

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/reviews/64f8a1b2c3d4e5f6a7b8c9d1/helpful \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isHelpful": 4,
    "isMarkedByUser": true
  }
}
```

## 🔒 Security Features

### 1. One Review Per User Per Product
- Users can only create one review per product
- Attempting to create a duplicate review returns an error

### 2. Company Isolation
- Reviews are filtered by company ID
- Users can only access reviews from their company

### 3. User Authorization
- Users can only update/delete their own reviews
- Admin users have no special privileges for reviews

### 4. Input Validation
- Rating: 1-5 stars
- Title: Max 100 characters
- Comment: Max 1000 characters
- Images: Max 5 files per review

## 📊 Review Statistics

The API provides comprehensive statistics:

```json
{
  "stats": {
    "averageRating": 4.2,
    "totalReviews": 25
  }
}
```

## 🖼️ Image Handling

### Supported Features:
- Multiple images per review (up to 5)
- Automatic file upload to `/uploads` directory
- Unique filename generation with timestamps
- Image paths stored in database

### Image Upload Example:
```javascript
const formData = new FormData();
formData.append('productId', '64f8a1b2c3d4e5f6a7b8c9d0');
formData.append('rating', '5');
formData.append('title', 'Great Product!');
formData.append('comment', 'Love this product!');
formData.append('images', file1);
formData.append('images', file2);

fetch('/api/reviews', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'x-company-id': companyId
  },
  body: formData
});
```

## 🚨 Error Handling

### Common Error Responses:

**400 - Bad Request:**
```json
{
  "message": "Product ID, rating, title, and comment are required"
}
```

**400 - Duplicate Review:**
```json
{
  "message": "You have already reviewed this product"
}
```

**404 - Product Not Found:**
```json
{
  "message": "Product not found"
}
```

**404 - Review Not Found:**
```json
{
  "message": "Review not found"
}
```

**404 - Unauthorized Update/Delete:**
```json
{
  "message": "Review not found or you are not authorized to update it"
}
```

## 📈 Performance Features

### Database Indexes:
- Compound index on `userId` and `productId` (unique)
- Index on `productId` and `companyId` for efficient queries
- Index on `companyId` and `createdAt` for sorting

### Pagination:
- Configurable page size (default: 10)
- Efficient skip/limit queries
- Total count for pagination info

### Population:
- User details (name only)
- Product details (name, images)
- Optimized field selection

## 🔄 Integration with Existing APIs

The Review API integrates seamlessly with:
- **Product API**: Validates product existence and company ownership
- **User API**: Uses authenticated user information
- **Upload API**: Leverages existing file upload middleware
- **Auth API**: Uses existing JWT authentication

## 📝 Usage Examples

### Frontend Integration (JavaScript):
```javascript
// Create a review
async function createReview(productId, rating, title, comment, images) {
  const formData = new FormData();
  formData.append('productId', productId);
  formData.append('rating', rating);
  formData.append('title', title);
  formData.append('comment', comment);
  
  images.forEach(image => {
    formData.append('images', image);
  });

  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-company-id': companyId
    },
    body: formData
  });

  return response.json();
}

// Get product reviews
async function getProductReviews(productId, page = 1, limit = 10) {
  const response = await fetch(
    `/api/reviews/product/${productId}?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId
      }
    }
  );

  return response.json();
}
```

This comprehensive Review API provides all the functionality needed for a robust product review system with image support, helpful voting, and proper security measures. 