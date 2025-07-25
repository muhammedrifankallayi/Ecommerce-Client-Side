# 📝 Razorpay Backend API Integration Guide

## 1. **Create Razorpay Order Endpoint**

**Endpoint:**  
`POST /api/payments/razorpay-order`

**Request Body:**
```json
{
  "amount": 50000 // Amount in paise (e.g., 50000 = ₹500.00)
}
```

**Response:**
```json
{
  "orderId": "order_9A33XWu170gUtm",
  "amount": 50000,
  "currency": "INR"
}
```

**What it should do:**
- Use your Razorpay **Secret Key** (never expose to frontend) to create an order via Razorpay’s API.
- Return the `orderId`, `amount`, and `currency` to the frontend.

**Node.js Example (Express):**
```js
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

router.post('/razorpay-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      payment_capture: 1
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

module.exports = router;
```

---

## 2. **(Optional but Recommended) Payment Verification Endpoint**

**Endpoint:**  
`POST /api/payments/verify`

**Request Body:**
```json
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}
```

**What it should do:**
- Use Razorpay’s utility to verify the payment signature.
- Mark the order as paid in your database if verification succeeds.

**Node.js Example:**
```js
const crypto = require('crypto');

router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const key_secret = process.env.RAZORPAY_SECRET;

  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment is verified, update your DB here
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid signature' });
  }
});
```

---

## 3. **Environment Variables Needed**
- `RAZORPAY_KEY_ID` (public, for frontend and backend)
- `RAZORPAY_SECRET` (private, backend only)

---

## 4. **Frontend Flow**
- Call `/api/payments/razorpay-order` to get an order ID.
- Use the order ID and your public key to open Razorpay checkout.
- On payment success, optionally call `/api/payments/verify` to confirm payment.

---

**That’s it!**  
This setup keeps your secret key safe and ensures secure, verifiable payments. 