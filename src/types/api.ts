import { Product, Inventory } from './index';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CartItem {
  _id: string;
  userId: string;
  companyId: string;
  inventoryId: {
    _id: string;
    productId: {
      _id: string;
      name: string;
      category?: {
        _id: string;
        name: string;
      };
      images: string[];
      brand?: {
        _id: string;
        name: string;
      };
    };
    sku: string;
    inventorySlug: string;
    variantCombination: Array<{
      variantId: {
        _id: string;
        name: string;
      };
      value: string;
      _id: string;
    }>;
    stock: number;
    price: number;
    minStock: number;
    maxStock: number;
    isActive: boolean;
    barcode: string;
    location: string;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  items: CartItem[];
  summary: {
    totalItems: number;
    subtotal: number;
    itemCount: number;
  };
}

export interface ProductFilters {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  inStock?: boolean;
  active?: number; // 1 for active, 0 for inactive
}

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

// Cart types based on CART_API_GUIDE
export interface CartItemOption {
  _id: string;
  name: string;
  hexCode?: string; // For colors
}

export interface CartItemSelectedOptions {
  color?: CartItemOption;
  size?: CartItemOption;
  variant?: string;
}

export interface CartItemProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  category?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: number;
  addedAt: string;
}

// Banner types
export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
}

// Order types
export interface ReturnRequest {
  requested: boolean;
  status: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface OrderInventoryVariant {
  variantId: string;
  value: string;
  _id: string;
}

export interface OrderInventoryProduct {
  _id: string;
  name: string;
  images: string[];
}

export interface OrderInventory {
  _id: string;
  productId: OrderInventoryProduct;
  companyId: string;
  sku: string;
  inventorySlug: string;
  variantCombination: OrderInventoryVariant[];
  stock: number;
  price: number;
  minStock: number;
  maxStock: number;
  isActive: boolean;
  barcode: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  returnRequest: ReturnRequest;
  inventory: OrderInventory;
  name: string;
  quantity: number;
  price: number;
  image: string;
  _id: string;
}

export interface OrderShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  _id: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
  _id: string;
}

export interface Order {
  returnRequest: ReturnRequest;
  _id: string;
  companyId: string;
  userId: OrderUser;
  orderItems: OrderItem[];
  shippingAddress: OrderShippingAddress;
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cancelled: boolean;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  paidAt?: string;
  paymentResult?: PaymentResult;
}

export interface OrdersListResponse {
  orders: Order[];
  page: number;
  pages: number;
  total: number;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

// Address types for Address API
export interface AddressDetails {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserAddress {
  _id: string;
  type: 'shipping' | 'billing' | 'other';
  isDefault: boolean;
  name: string;
  phone: string;
  address: AddressDetails;
}

export interface AddressRequest {
  type: 'shipping' | 'billing' | 'other';
  isDefault?: boolean;
  name: string;
  phone: string;
  address: AddressDetails;
}

export interface AddressResponse {
  data: UserAddress | UserAddress[];
  message?: string;
  success: boolean;
}

export interface OrderItemPayload {
  inventory: string;
  quantity: number;
}
