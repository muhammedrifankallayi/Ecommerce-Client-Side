
export interface VariantInfo {
  _id: string;
  name: string;  // e.g., "Size", "Color"
  type: string;  // e.g., "size", "color"
}

export interface VariantCombination {
  variantId: VariantInfo;
  value: string;  // e.g., "L" for size, "Red" for color
}

export interface Inventory {
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

export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price?: number;
  stock?: number;
  category?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  inventories?: Inventory[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  slug?: string;
  // Frontend compatibility properties
  id?: string; // Alias for _id
  image?: string; // Main image URL
  inStock?: boolean; // Calculated stock status
  colorName?: string; // Color name
  rating?: number; // Product rating
  reviews?: number; // Number of reviews
  featured?: boolean; // Featured status
  sizes?: string[]; // Available sizes
}

export interface ProductWithInventory extends Product {
  inventories: Inventory[];
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isHelpful: number;
  helpfulUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  status: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  // Frontend compatibility
  id?: string; // Alias for _id
  image?: string;
}

export interface Reply {
  id: number;
  userId: number;
  userName: string;
  comment: string;
  date: string;
}

// Re-export API types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  ProductFilters,
  OrderFilters,
  WishlistItem,
  Banner,
  Order,
  OrderItem,
  Address,
  User,
  UpdateUserProfile
} from './api';
