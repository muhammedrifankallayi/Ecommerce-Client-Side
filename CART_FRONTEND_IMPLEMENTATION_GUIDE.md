# Cart Frontend Implementation Guide

## Overview

This guide demonstrates how to implement the cart functionality in your frontend application using React and TypeScript. The implementation includes handling product variants, stock management, and real-time updates.

## Table of Contents
- [Types and Interfaces](#types-and-interfaces)
- [API Service](#api-service)
- [React Hooks](#react-hooks)
- [Components](#components)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Example Implementation](#example-implementation)

## Types and Interfaces

```typescript
// types/cart.ts

export interface VariantInfo {
  _id: string;
  name: string;
  type: string;
}

export interface VariantCombination {
  variantId: VariantInfo;
  value: string;
}

export interface ProductInfo {
  _id: string;
  name: string;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
}

export interface InventoryInfo {
  _id: string;
  sku: string;
  price: number;
  stock: number;
  productId: ProductInfo;
  variantCombination: VariantCombination[];
}

export interface CartItem {
  _id: string;
  inventoryId: InventoryInfo;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  itemCount: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}
```

## API Service

```typescript
// services/cartService.ts

import axios, { AxiosError } from 'axios';
import { Cart, CartItem } from '../types/cart';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export class CartError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'CartError';
  }
}

export class CartService {
  private static headers = {
    'Content-Type': 'application/json',
  };

  private static getAuthHeaders(token: string, companyId: string) {
    return {
      ...this.headers,
      'Authorization': `Bearer ${token}`,
      'x-company-id': companyId
    };
  }

  static async getCart(token: string, companyId: string): Promise<Cart> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: this.getAuthHeaders(token, companyId)
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  static async addToCart(
    token: string,
    companyId: string,
    inventoryId: string,
    quantity: number = 1
  ): Promise<CartItem> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/cart`,
        { inventoryId, quantity },
        { headers: this.getAuthHeaders(token, companyId) }
      );
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  static async updateCartItem(
    token: string,
    companyId: string,
    itemId: string,
    quantity: number
  ): Promise<CartItem> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/cart/${itemId}`,
        { quantity },
        { headers: this.getAuthHeaders(token, companyId) }
      );
      return response.data.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  static async removeFromCart(
    token: string,
    companyId: string,
    itemId: string
  ): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/cart/${itemId}`,
        { headers: this.getAuthHeaders(token, companyId) }
      );
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  static async clearCart(token: string, companyId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/cart`,
        { headers: this.getAuthHeaders(token, companyId) }
      );
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private static handleError(error: AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'An error occurred';
      
      switch (status) {
        case 401:
          throw new CartError('Authentication required', 'UNAUTHORIZED', status);
        case 404:
          throw new CartError('Item not found', 'NOT_FOUND', status);
        case 400:
          if (message.includes('Insufficient stock')) {
            throw new CartError('Not enough stock available', 'INSUFFICIENT_STOCK', status);
          }
          throw new CartError(message, 'BAD_REQUEST', status);
        default:
          throw new CartError('An error occurred with the cart operation', 'UNKNOWN', status);
      }
    }
    throw new CartError('Network error occurred', 'NETWORK_ERROR');
  }
}
```

## React Hooks

```typescript
// hooks/useCart.ts

import { useState, useEffect, useCallback } from 'react';
import { Cart, CartItem } from '../types/cart';
import { CartService, CartError } from '../services/cartService';
import { useAuth } from './useAuth'; // Your auth hook

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, companyId } = useAuth(); // Get from your auth context

  const fetchCart = useCallback(async () => {
    if (!token || !companyId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await CartService.getCart(token, companyId);
      setCart(data);
    } catch (err) {
      setError(err instanceof CartError ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [token, companyId]);

  const addToCart = useCallback(async (inventoryId: string, quantity: number = 1) => {
    if (!token || !companyId) return;

    try {
      setError(null);
      await CartService.addToCart(token, companyId, inventoryId, quantity);
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      setError(err instanceof CartError ? err.message : 'Failed to add item to cart');
      return false;
    }
  }, [token, companyId, fetchCart]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!token || !companyId) return;

    try {
      setError(null);
      await CartService.updateCartItem(token, companyId, itemId, quantity);
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      setError(err instanceof CartError ? err.message : 'Failed to update quantity');
      return false;
    }
  }, [token, companyId, fetchCart]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!token || !companyId) return;

    try {
      setError(null);
      await CartService.removeFromCart(token, companyId, itemId);
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      setError(err instanceof CartError ? err.message : 'Failed to remove item');
      return false;
    }
  }, [token, companyId, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!token || !companyId) return;

    try {
      setError(null);
      await CartService.clearCart(token, companyId);
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      setError(err instanceof CartError ? err.message : 'Failed to clear cart');
      return false;
    }
  }, [token, companyId, fetchCart]);

  useEffect(() => {
    if (token && companyId) {
      fetchCart();
    }
  }, [token, companyId, fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart
  };
};
```

## Components

### Cart Item Component

```typescript
// components/CartItem.tsx

import React from 'react';
import { CartItem as CartItemType } from '../types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove
}) => {
  const { inventoryId, quantity } = item;
  const { productId, price, stock, variantCombination } = inventoryId;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      await onUpdateQuantity(item._id, newQuantity);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={productId.images[0]} 
          alt={productId.name}
          className="product-image"
        />
      </div>

      <div className="cart-item-details">
        <h3 className="product-name">{productId.name}</h3>
        
        <div className="variant-info">
          {variantCombination.map((combo, index) => (
            <span key={combo.variantId._id} className="variant-tag">
              {combo.variantId.name}: {combo.value}
              {index < variantCombination.length - 1 ? ' / ' : ''}
            </span>
          ))}
        </div>

        <div className="price-stock-info">
          <span className="price">${price.toFixed(2)}</span>
          {stock < 5 && (
            <span className="stock-warning">
              Only {stock} left in stock!
            </span>
          )}
        </div>

        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="quantity-btn"
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= stock}
            className="quantity-btn"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(item._id)}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
```

### Cart Container Component

```typescript
// components/CartContainer.tsx

import React from 'react';
import { useCart } from '../hooks/useCart';
import { CartItem } from './CartItem';
import { LoadingSpinner } from './LoadingSpinner'; // Your loading component
import { ErrorMessage } from './ErrorMessage'; // Your error component

export const CartContainer: React.FC = () => {
  const {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!cart || cart.items.length === 0) {
    return <div className="empty-cart">Your cart is empty</div>;
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart ({cart.summary.itemCount} items)</h2>
        <button
          onClick={clearCart}
          className="clear-cart-btn"
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {cart.items.map(item => (
          <CartItem
            key={item._id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Total Items:</span>
          <span>{cart.summary.totalItems}</span>
        </div>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${cart.summary.subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
```

### Add to Cart Button Component

```typescript
// components/AddToCartButton.tsx

import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';

interface AddToCartButtonProps {
  inventoryId: string;
  stock: number;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  inventoryId,
  stock,
  className
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (stock <= 0) {
      setError('Out of stock');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const success = await addToCart(inventoryId);
      if (success) {
        // Optional: Show success message or trigger animation
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-to-cart-container">
      <button
        onClick={handleAddToCart}
        disabled={loading || stock <= 0}
        className={`add-to-cart-btn ${className || ''} ${stock <= 0 ? 'disabled' : ''}`}
      >
        {loading ? 'Adding...' : stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
```

## Example Usage

```typescript
// pages/ProductPage.tsx

import React from 'react';
import { AddToCartButton } from '../components/AddToCartButton';

interface ProductPageProps {
  inventoryId: string;
  stock: number;
}

export const ProductPage: React.FC<ProductPageProps> = ({ inventoryId, stock }) => {
  return (
    <div className="product-page">
      {/* Other product details */}
      <AddToCartButton
        inventoryId={inventoryId}
        stock={stock}
        className="product-page-cart-btn"
      />
    </div>
  );
};

// pages/CartPage.tsx

import React from 'react';
import { CartContainer } from '../components/CartContainer';

export const CartPage: React.FC = () => {
  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <CartContainer />
    </div>
  );
};
```

## CSS Styling Example

```css
/* styles/cart.css */

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #eee;
  gap: 20px;
}

.cart-item-image {
  width: 120px;
  height: 120px;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-details {
  flex: 1;
}

.variant-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.quantity-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stock-warning {
  color: #e65100;
  font-size: 14px;
  margin-left: 10px;
}

.cart-summary {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.add-to-cart-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart-btn:hover {
  background: #45a049;
}

.add-to-cart-btn.disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 5px;
}
```

## Best Practices

1. **State Management**
   - Use React Context or Redux for global cart state
   - Implement optimistic updates for better UX
   - Handle loading and error states properly

2. **Performance**
   - Implement debouncing for quantity updates
   - Use React.memo for cart items
   - Lazy load images
   - Implement virtual scrolling for large carts

3. **Error Handling**
   - Show user-friendly error messages
   - Handle network errors gracefully
   - Implement retry mechanisms
   - Validate stock before updates

4. **Security**
   - Never store sensitive data in localStorage
   - Validate all API responses
   - Implement proper authentication checks
   - Use HTTPS for all API calls

5. **Accessibility**
   - Add proper ARIA labels
   - Ensure keyboard navigation
   - Provide clear feedback for actions
   - Use semantic HTML

6. **Testing**
   - Write unit tests for components
   - Test edge cases (empty cart, network errors)
   - Test stock validation
   - Test cart calculations

## Common Issues and Solutions

1. **Race Conditions**
   ```typescript
   // Bad
   const updateQuantity = async (itemId: string, quantity: number) => {
     await updateCartItem(itemId, quantity);
     await fetchCart();
   };

   // Good
   const updateQuantity = async (itemId: string, quantity: number) => {
     setLoading(true);
     try {
       await updateCartItem(itemId, quantity);
       await fetchCart();
     } finally {
       setLoading(false);
     }
   };
   ```

2. **Stock Validation**
   ```typescript
   // Bad
   const addToCart = (inventoryId: string, quantity: number) => {
     cartService.addToCart(inventoryId, quantity);
   };

   // Good
   const addToCart = async (inventoryId: string, quantity: number) => {
     try {
       const inventory = await inventoryService.getInventory(inventoryId);
       if (inventory.stock < quantity) {
         throw new Error('Insufficient stock');
       }
       await cartService.addToCart(inventoryId, quantity);
     } catch (error) {
       handleError(error);
     }
   };
   ```

3. **Error Recovery**
   ```typescript
   // Bad
   const updateQuantity = async (itemId: string, quantity: number) => {
     try {
       await cartService.updateQuantity(itemId, quantity);
     } catch (error) {
       console.error(error);
     }
   };

   // Good
   const updateQuantity = async (itemId: string, quantity: number) => {
     const previousQuantity = cart.items.find(item => item._id === itemId)?.quantity;
     try {
       setOptimisticQuantity(itemId, quantity);
       await cartService.updateQuantity(itemId, quantity);
     } catch (error) {
       if (previousQuantity) {
         setOptimisticQuantity(itemId, previousQuantity); // Rollback
       }
       handleError(error);
     }
   };
   ``` 