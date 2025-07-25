# 🛒 Order API Frontend Integration Guide

This guide explains how to integrate the Order API from your frontend application, including authentication, required headers, request/response formats, and best practices.

---

## 1. **Authentication**
- All order endpoints require a valid JWT token (Bearer token) in the `Authorization` header.
- The `x-company-id` header is **mandatory** for all requests.

---

## 2. **Create Order**

### **Endpoint**
`POST /api/orders`

### **Headers**
- `Authorization: Bearer <JWT_TOKEN>`
- `x-company-id: <COMPANY_ID>`
- `Content-Type: application/json`

### **Request Body Example**
```json
{
  "orderItems": [
    {
      "product": "<PRODUCT_ID>",
      "name": "Product Name",
      "quantity": 2,
      "price": 499,
      "image": "/uploads/product-image.jpg"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Mumbai",
    "postalCode": "400001",
    "country": "India",
    "phone": "9876543210"
  },
  "paymentMethod": "Razorpay", // or PayPal, Stripe, etc.
  "taxPrice": 50,
  "shippingPrice": 40,
  "totalPrice": 1088
}
```

### **Response Example (201 Created)**
```json
{
  "_id": "<ORDER_ID>",
  "companyId": "<COMPANY_ID>",
  "orderItems": [ ... ],
  "shippingAddress": { ... },
  "paymentMethod": "Razorpay",
  "taxPrice": 50,
  "shippingPrice": 40,
  "totalPrice": 1088,
  "isPaid": false,
  "isDelivered": false,
  "status": "pending",
  "orderNumber": "ORD2407130001",
  "createdAt": "2024-07-13T12:34:56.789Z",
  ...
}
```

### **Error Responses**
- `401 Unauthorized`: Missing or invalid token, or missing `x-company-id`.
- `400 Bad Request`: Missing/invalid fields, no order items, insufficient stock, etc.
- `404 Not Found`: Product not found.

---

## 3. **Frontend Example (React + Axios)**

```js
import axios from 'axios';

async function createOrder(orderData, token, companyId) {
  try {
    const response = await axios.post(
      '/api/orders',
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-company-id': companyId,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // The created order
  } catch (error) {
    // Handle error (show message to user, etc.)
    if (error.response) {
      throw new Error(error.response.data.message || 'Order creation failed');
    }
    throw error;
  }
}
```

---

## 4. **Best Practices**
- **Validate cart and user input** before sending the order.
- **Show loading and error states** in your UI.
- **Handle stock errors** gracefully (e.g., show which product is out of stock).
- **Store the returned order ID** for payment and order tracking.
- **Always use HTTPS** in production.

---

## 5. **Order Flow Summary**
1. User adds items to cart.
2. User fills shipping address and selects payment method.
3. Frontend calls `POST /api/orders` to create the order.
4. On success, proceed to payment (e.g., Razorpay integration).
5. After payment, call the payment verification endpoint to update order status.

---

**For more details, see the backend API docs or contact the backend team.** 