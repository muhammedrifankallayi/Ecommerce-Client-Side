# 🚚 Order Cancel & Return Frontend Integration Guide

This guide explains how to implement order cancel and return (per-order and per-item) in your frontend, including API usage, eligibility, and user/admin flows.

---

## 1. **Order Cancel (User)**

### **Endpoint**
`POST /api/orders/{orderId}/cancel`

### **Headers**
- `Authorization: Bearer <JWT_TOKEN>`
- `x-company-id: <COMPANY_ID>`

### **Request Body Example**
```json
{
  "reason": "I changed my mind."
}
```

### **Response Example**
```json
{
  "success": true,
  "message": "Order cancelled."
}
```

### **Eligibility**
- Only if order is not shipped/delivered (status: 'pending' or 'processing').

---

## 2. **Order Return (User, Per-Order)**

### **Endpoint**
`POST /api/orders/{orderId}/return`

### **Request Body Example**
```json
{
  "reason": "Product was defective",
  "images": ["/uploads/defect1.jpg"],
  "note": "Box was damaged"
}
```

### **Eligibility**
- Only if order is delivered and within 2 days of delivery.

### **Status Flow**
- After request: status is 'pending'.
- User sees status: 'pending', 'approved', or 'rejected'.

---

## 3. **Order Return (User, Per-Item)**

### **Endpoint**
`POST /api/orders/{orderId}/items/{itemId}/return`

### **Request Body Example**
```json
{
  "reason": "Wrong size",
  "images": ["/uploads/wrongsize.jpg"],
  "note": "Need a larger size"
}
```

### **Eligibility**
- Only if item is delivered and within 2 days of delivery.

---

## 4. **Admin Approval (Per-Order & Per-Item)**

### **Approve Return**
- Per-order: `POST /api/orders/{orderId}/return/approve`
- Per-item: `POST /api/orders/{orderId}/items/{itemId}/return/approve`
- Body: `{ "adminNote": "Return approved, please ship back the item." }`

### **Reject Return**
- Per-order: `POST /api/orders/{orderId}/return/reject`
- Per-item: `POST /api/orders/{orderId}/items/{itemId}/return/reject`
- Body: `{ "adminNote": "Return rejected due to policy." }`

---

## 5. **Frontend Flow**
- Show "Cancel" or "Request Return" buttons if eligible.
- Show return/cancel status in order details.
- For returns, show reason, images, and admin notes/status.
- For admin, show pending requests and approve/reject actions.

---

## 6. **Best Practices**
- Always check eligibility before showing action buttons.
- Show clear status and messages to users.
- Notify users on approval/rejection.
- Keep UI consistent for both per-order and per-item flows.

---

**For more details, see the backend API docs or contact the backend team.** 