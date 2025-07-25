# 🧾 Payment Handling & `isPaid` Field Documentation

This document explains how payment status (`isPaid`) is managed in the backend, including the order lifecycle, payment verification, and relevant API endpoints.

---

## 1. **Order Creation**
- **Endpoint:** `POST /api/orders`
- **Behavior:**
  - When a new order is created, the `isPaid` field is **not** set by the frontend.
  - The backend automatically sets `isPaid: false` for all new orders.
  - The order is saved with payment status as unpaid.

---

## 2. **Payment Flow**
- After order creation, the frontend initiates payment using a payment gateway (e.g., Razorpay, PayPal, Stripe).
- Once payment is completed by the user, the frontend must call the backend to verify the payment.

### **Razorpay Example**
- **Step 1:** Create Razorpay order (optional, for Razorpay)
  - `POST /api/orders/payments/razorpay-order`
- **Step 2:** Complete payment on frontend (user pays via Razorpay UI)
- **Step 3:** Verify payment on backend
  - `POST /api/orders/payments/verify`
  - The frontend sends payment details (order ID, payment ID, signature, etc.) to this endpoint.
  - The backend verifies the payment signature and updates the order.

---

## 3. **How `isPaid` is Updated**
- The backend sets `order.isPaid = true` **only after successful payment verification**.
- The backend also sets:
  - `order.paidAt = <current date/time>`
  - `order.status = 'processing'` (or similar)
  - `order.paymentResult = { ... }` (details of the payment)
- **The frontend cannot set `isPaid` directly.**

---

## 4. **Relevant Endpoints**

### **Order Creation**
- `POST /api/orders`
  - Creates a new order with `isPaid: false`.

### **Payment Verification**
- `POST /api/orders/payments/verify`
  - Verifies payment and updates `isPaid` to `true` if successful.

### **Manual Payment Update (if implemented)**
- `PUT /api/orders/:id/pay`
  - Used for some payment flows to mark an order as paid after verification.

---

## 5. **Security Note**
- The backend **never** trusts the frontend to set `isPaid`.
- Only after verifying payment with the payment gateway does the backend update the payment status.
- This prevents fraudulent marking of orders as paid.

---

## 6. **Summary for Developers**
- **Do not** send `isPaid` in the order creation request from the frontend.
- Always use the payment verification endpoint after payment is completed.
- The backend will handle updating the order's payment status securely.

---

For questions or integration help, contact the backend team. 