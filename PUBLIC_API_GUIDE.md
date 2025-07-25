# Public API Guide

This guide covers the Public API endpoints that allow access to products, reviews, brands, and categories without JWT authentication. These APIs only require the `x-company-id` header for authorization.

## 📋 Overview

The Public API provides read-only access to:
- **Products** - Browse and search products
- **Reviews** - View product reviews and ratings
- **Brands** - List and search brands
- **Categories** - List and search categories

## 🔐 Authentication

**Only requires:**
- `x-company-id` header with valid company ID

**No JWT token required** - These are public endpoints for browsing and viewing data.

## 🚨 Security

- **Company Isolation**: All data is filtered by company ID
- **Read-Only**: No create, update, or delete operations
- **Public Access**: Anyone with a valid company ID can access

## 📝 API Endpoints

### 1. Products

#### Get All Products
**GET** `/api/public/products`

Get all products with filtering, search, and pagination.

**Headers:**
```http
x-company-id: YOUR_COMPANY_ID
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `category` (optional): Filter by category ID
- `brand` (optional): Filter by brand ID
- `search` (optional): Search in product name and description

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/public/products?page=1&category=64f8a1b2c3d4e5f6a7b8c9d0&search=shirt" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Classic T-Shirt",
        "description": "Comfortable cotton t-shirt",
        "price": 29.99,
        "images": ["uploads/image1.jpg"],
        "stock": 100,
        "category": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "T-Shirts"
        },
        "brand": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Nike"
        },
        "color": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
          "name": "Red",
          "hexCode": "#FF0000"
        },
        "size": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
          "name": "Large"
        },
        "variants": [
          {
            "variantId": {
              "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
              "name": "Size",
              "values": ["S", "M", "L", "XL"]
            },
            "value": "L"
          }
        ],
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### Get Single Product with Inventory

Retrieves detailed information about a specific product including its active inventory variants.

#### Endpoint
```http
GET /api/public/products/:id
```

#### Headers Required
```http
x-company-id: "your_company_id"
```

#### Parameters
| Parameter | Type   | In   | Description      | Required |
|-----------|--------|------|------------------|----------|
| id        | string | path | Product ID (MongoDB ObjectId) | Yes      |

#### Response Format
```typescript
interface VariantInfo {
  _id: string;
  name: string;  // e.g., "Size", "Color"
  type: string;  // e.g., "size", "color"
}

interface VariantCombination {
  variantId: VariantInfo;
  value: string;  // e.g., "L" for size, "Red" for color
}

interface Inventory {
  _id: string;
  sku: string;
  stock: number;
  price: number;
  variantCombination: VariantCombination[];
  isActive: boolean;
  barcode?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    description: string;
    images: string[];
    category: {
      _id: string;
      name: string;
    };
    brand: {
      _id: string;
      name: string;
    };
    inventories: Inventory[];
    // ... other product fields
  };
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Classic T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "images": ["image1.jpg", "image2.jpg"],
    "category": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "T-Shirts"
    },
    "brand": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "name": "Fashion Brand"
    },
    "inventories": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
        "sku": "TSH-BLK-L",
        "stock": 50,
        "price": 29.99,
        "variantCombination": [
          {
            "variantId": {
              "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
              "name": "Size",
              "type": "size"
            },
            "value": "L"
          },
          {
            "variantId": {
              "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
              "name": "Color",
              "type": "color"
            },
            "value": "Black"
          }
        ],
        "isActive": true,
        "barcode": "123456789",
        "location": "Warehouse A",
        "createdAt": "2024-03-15T10:30:00.000Z",
        "updatedAt": "2024-03-15T10:30:00.000Z"
      }
    ]
  }
}
```

#### Frontend Implementation Guide

1. **API Call Example (using Axios)**
```typescript
import axios from 'axios';

const getProduct = async (productId: string, companyId: string) => {
  try {
    const response = await axios.get(`/api/public/products/${productId}`, {
      headers: {
        'x-company-id': companyId
      }
    });
    return response.data;
  } catch (error) {
    // Handle errors appropriately
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Missing company ID');
      }
    }
    throw error;
  }
};
```

2. **React Component Example**
```typescript
import React, { useState, useEffect } from 'react';

interface ProductDetailsProps {
  productId: string;
  companyId: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, companyId }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(productId, companyId);
        setProduct(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, companyId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* Display product images */}
      <div className="product-images">
        {product.images.map((image: string, index: number) => (
          <img 
            key={index} 
            src={image} 
            alt={`${product.name} - ${index + 1}`} 
          />
        ))}
      </div>

      {/* Display variant options */}
      <div className="variant-options">
        {product.inventories.map((inventory: any) => (
          <div key={inventory._id} className="variant-item">
            <h3>SKU: {inventory.sku}</h3>
            <p>Price: ${inventory.price}</p>
            <p>Stock: {inventory.stock}</p>
            
            {/* Display variant combinations */}
            <div className="variant-combinations">
              {inventory.variantCombination.map((combo: any, index: number) => (
                <span key={index}>
                  {combo.variantId.name}: {combo.value}
                  {index < inventory.variantCombination.length - 1 ? ' / ' : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
```

3. **Usage Example**
```typescript
// In your parent component
<ProductDetails 
  productId="65f1a2b3c4d5e6f7g8h9i0j1"
  companyId="your_company_id"
/>
```

#### Best Practices

1. **Error Handling**
   - Always handle API errors appropriately
   - Show user-friendly error messages
   - Implement retry logic for network failures if needed

2. **Loading States**
   - Show loading indicators while fetching data
   - Implement skeleton loaders for better UX
   - Handle empty states appropriately

3. **Caching**
   - Consider implementing client-side caching for frequently accessed products
   - Use React Query or similar libraries for efficient data caching

4. **Inventory Management**
   - Update stock display in real-time if websocket updates are available
   - Show "Out of Stock" for inventories with stock = 0
   - Disable purchase options for out-of-stock items

5. **Variant Selection**
   - Group variants by type (e.g., all sizes, all colors)
   - Show price differences between variants
   - Highlight available/unavailable combinations

6. **Performance**
   - Implement image lazy loading
   - Use image optimization and proper sizing
   - Consider implementing virtual scrolling for long lists of variants

#### Security Considerations

1. Always store the company ID securely
2. Validate all API responses before using them
3. Sanitize any user-generated content before displaying
4. Implement proper error boundaries in React components
5. Use HTTPS for all API calls

### 2. Reviews

#### Get Product Reviews
**GET** `/api/public/reviews/product/:productId`

Get all reviews for a specific product with rating statistics.

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
curl -X GET "http://localhost:5000/api/public/reviews/product/64f8a1b2c3d4e5f6a7b8c9d1?page=1&limit=5&sort=-rating" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
        "productId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "Classic T-Shirt",
          "images": ["uploads/image1.jpg"]
        },
        "userId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
          "name": "John Doe"
        },
        "rating": 5,
        "title": "Excellent Product!",
        "comment": "Amazing quality and fast delivery.",
        "images": ["uploads/review-image1.jpg"],
        "isVerified": false,
        "isHelpful": 3,
        "helpfulUsers": ["64f8a1b2c3d4e5f6a7b8c9d8"],
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 15,
      "pages": 3
    },
    "stats": {
      "averageRating": 4.2,
      "totalReviews": 15
    }
  }
}
```

### 3. Brands

#### Get All Brands
**GET** `/api/public/brands`

Get all brands with search and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Brands per page (default: 10)
- `search` (optional): Search in brand name

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/public/brands?page=1&search=nike" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "Nike",
        "description": "Just Do It",
        "logo": "uploads/nike-logo.jpg",
        "website": "https://nike.com",
        "companyId": "64f8a1b2c3d4e5f6a7b8c9d9",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

#### Get Single Brand
**GET** `/api/public/brands/:id`

Get detailed information about a specific brand.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/public/brands/64f8a1b2c3d4e5f6a7b8c9d2 \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "Nike",
    "description": "Just Do It",
    "logo": "uploads/nike-logo.jpg",
    "website": "https://nike.com",
    "companyId": "64f8a1b2c3d4e5f6a7b8c9d9",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 4. Categories

#### Get All Categories
**GET** `/api/public/categories`

Get all categories with search and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Categories per page (default: 10)
- `search` (optional): Search in category name

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/public/categories?page=1&search=shirt" \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "T-Shirts",
        "description": "Comfortable t-shirts for everyday wear",
        "image": "uploads/tshirt-category.jpg",
        "companyId": "64f8a1b2c3d4e5f6a7b8c9d9",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

#### Get Single Category
**GET** `/api/public/categories/:id`

Get detailed information about a specific category.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/public/categories/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "x-company-id: YOUR_COMPANY_ID"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "T-Shirts",
    "description": "Comfortable t-shirts for everyday wear",
    "image": "uploads/tshirt-category.jpg",
    "companyId": "64f8a1b2c3d4e5f6a7b8c9d9",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

## 🚨 Error Handling

### Common Error Responses:

**401 - Missing Company ID:**
```json
{
  "message": "Missing x-company-id header"
}
```

**404 - Resource Not Found:**
```json
{
  "message": "Product not found"
}
```

**400 - Bad Request:**
```json
{
  "message": "Invalid parameters"
}
```

## 📝 Usage Examples

### Frontend Integration (JavaScript):

#### Get Products with Search:
```javascript
async function getProducts(companyId, search = '', category = '', brand = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (brand) params.append('brand', brand);
  
  const response = await fetch(`/api/public/products?${params}`, {
    headers: {
      'x-company-id': companyId
    }
  });
  
  return response.json();
}

// Usage
const products = await getProducts('your-company-id', 'shirt', 'category-id');
```

#### Get Product Reviews:
```javascript
async function getProductReviews(companyId, productId, page = 1) {
  const response = await fetch(
    `/api/public/reviews/product/${productId}?page=${page}`,
    {
      headers: {
        'x-company-id': companyId
      }
    }
  );
  
  return response.json();
}

// Usage
const reviews = await getProductReviews('your-company-id', 'product-id', 1);
```

#### Get Categories:
```javascript
async function getCategories(companyId, search = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  
  const response = await fetch(`/api/public/categories?${params}`, {
    headers: {
      'x-company-id': companyId
    }
  });
  
  return response.json();
}

// Usage
const categories = await getCategories('your-company-id', 'shirt');
```

### React Integration:
```jsx
import React, { useState, useEffect } from 'react';

const ProductList = ({ companyId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/public/products?${params}`, {
        headers: {
          'x-company-id': companyId
        }
      });
      
      const result = await response.json();
      setProducts(result.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [companyId]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => fetchProducts(e.target.value)}
      />
      
      {loading && <p>Loading...</p>}
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>Brand: {product.brand?.name}</p>
            <p>Category: {product.category?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
```

## 🔄 Integration with Other APIs

### Complete Product Browsing Flow:
```javascript
// 1. Get categories for navigation
const categories = await getCategories(companyId);

// 2. Get products filtered by category
const products = await getProducts(companyId, '', categoryId);

// 3. Get product details
const product = await fetch(`/api/public/products/${productId}`, {
  headers: { 'x-company-id': companyId }
}).then(res => res.json());

// 4. Get product reviews
const reviews = await getProductReviews(companyId, productId);
```

## 📈 Performance Features

### Optimizations:
- **Pagination**: All endpoints support pagination
- **Search**: Text search in relevant fields
- **Filtering**: Filter by category, brand, etc.
- **Sorting**: Multiple sort options for reviews
- **Population**: Related data included in responses

### Caching Strategy:
- **Static Data**: Categories and brands can be cached
- **Product Data**: Cache with short TTL
- **Reviews**: Cache with moderate TTL

## 🔒 Security Considerations

### Data Isolation:
- All data filtered by company ID
- No cross-company data access
- Read-only operations only

### Rate Limiting:
Consider implementing rate limiting for public APIs to prevent abuse.

### Monitoring:
Monitor API usage to detect unusual patterns.

This Public API provides secure, read-only access to your e-commerce data without requiring user authentication, making it perfect for public-facing applications and third-party integrations. 