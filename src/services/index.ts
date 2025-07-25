
// Export all services from a single entry point
export { apiService } from './api';
export { productService, ProductService } from './productService';
export { categoryService, CategoryService } from './categoryService';
export { brandService, BrandService } from './brandService';
export { bannerService, BannerService } from './bannerService';
export { orderService, OrderService } from './orderService';
export { wishlistService, WishlistService } from './wishlistService';
export { cartService, CartService } from './cartService';
export { userService, UserService } from './userService';
export { authService } from './authService';
export { companyService } from './companyService';
export { reviewService } from './reviewService';

// Export configuration
export * from './config';

// Re-export types for convenience
export type * from '@/types/api';
