# Address Management API – Frontend Integration Guide

This guide explains how to use the Address Management API from a frontend application (React, Vue, etc.). It covers all CRUD operations, setting default addresses, and best practices for user experience.

---

## 📋 Overview
- Each user can manage multiple addresses (shipping, billing, etc.)
- All endpoints require authentication (JWT) and `x-company-id` header
- Users can add, update, delete, list, and set default addresses

---

## 🔐 Authentication
- **JWT Token**: `Authorization: Bearer <token>`
- **Company ID**: `x-company-id: <company_id>`

---

## 📝 API Endpoints & Example Usage

### 1. List All Addresses
**GET** `/api/addresses`

```js
fetch('/api/addresses', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-company-id': companyId
  }
})
  .then(res => res.json())
  .then(data => console.log(data.data));
```

---

### 2. Add a New Address
**POST** `/api/addresses`

```js
fetch('/api/addresses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-company-id': companyId,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'shipping', // or 'billing', 'other'
    isDefault: true,
    name: 'John Doe',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    }
  })
})
  .then(res => res.json())
  .then(data => console.log(data.data));
```

---

### 3. Get a Single Address
**GET** `/api/addresses/:id`

```js
fetch(`/api/addresses/${addressId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-company-id': companyId
  }
})
  .then(res => res.json())
  .then(data => console.log(data.data));
```

---

### 4. Update an Address
**PUT** `/api/addresses/:id`

```js
fetch(`/api/addresses/${addressId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-company-id': companyId,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    phone: '+1987654321',
    address: {
      street: '456 Elm St',
      city: 'Boston',
      state: 'MA',
      postalCode: '02118',
      country: 'USA'
    },
    isDefault: false
  })
})
  .then(res => res.json())
  .then(data => console.log(data.data));
```

---

### 5. Delete an Address
**DELETE** `/api/addresses/:id`

```js
fetch(`/api/addresses/${addressId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-company-id': companyId
  }
})
  .then(res => res.json())
  .then(data => console.log(data.message));
```

---

### 6. Set Address as Default
**PATCH** `/api/addresses/:id/default`

```js
fetch(`/api/addresses/${addressId}/default`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-company-id': companyId
  }
})
  .then(res => res.json())
  .then(data => console.log(data.data));
```

---

## ⚛️ React Example: Address Book Component

```jsx
import React, { useEffect, useState } from 'react';

function AddressBook({ token, companyId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    const res = await fetch('/api/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    const data = await res.json();
    setAddresses(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [token, companyId]);

  const setDefault = async (id) => {
    await fetch(`/api/addresses/${id}/default`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    fetchAddresses();
  };

  const removeAddress = async (id) => {
    await fetch(`/api/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    fetchAddresses();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Addresses</h2>
      {addresses.map(addr => (
        <div key={addr._id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div><b>{addr.name}</b> ({addr.type}) {addr.isDefault && <span>⭐ Default</span>}</div>
          <div>{addr.address.street}, {addr.address.city}, {addr.address.state}, {addr.address.postalCode}, {addr.address.country}</div>
          <div>Phone: {addr.phone}</div>
          <button onClick={() => setDefault(addr._id)}>Set as Default</button>
          <button onClick={() => removeAddress(addr._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AddressBook;
```

---

## 🏆 Best Practices
- Always show which address is default in the UI
- Allow users to add, edit, and delete addresses easily
- Validate address fields on the frontend before sending
- Use address autocomplete APIs for better UX (optional)
- Refresh the address list after any change

---

## 🧪 Testing
- Test all endpoints with valid and invalid data
- Try adding, updating, deleting, and setting default addresses
- Ensure only the authenticated user can access their addresses

---

## 📚 Further Integration
- Use the default shipping address in the checkout flow
- Allow users to select from their address book during checkout
- Optionally, support address types (shipping, billing, other) in the UI

---

This guide should help you quickly integrate the address management API into any frontend application! 