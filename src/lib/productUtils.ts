import { Product } from '@/types';
import { BASE_URL } from '@/services/config';

/**
 * Transform API product to frontend-compatible format
 */
export const transformProduct = (apiProduct: Product): Product => {
  return {
    ...apiProduct,
    id: apiProduct._id, // Add id alias for frontend compatibility
    image: buildImageUrl(apiProduct.images?.[0] || ''), // Use first image as main image with base URL
    inStock: apiProduct.stock > 0, // Calculate inStock based on stock
    colorName: apiProduct.color?.name, // Extract color name
    rating: apiProduct.rating || 0, // Default rating
    reviews: apiProduct.reviews || 0, // Default reviews
    featured: apiProduct.featured || false, // Default featured
    sizes: apiProduct.variants
      ?.filter(v => v.variantId.name.toLowerCase() === 'size')
      .map(v => v.value) || [], // Extract sizes from variants
  };
};

/**
 * Transform array of API products to frontend-compatible format
 */
export const transformProducts = (apiProducts: Product[]): Product[] => {
  return apiProducts.map(transformProduct);
};

/**
 * Get product image URL
 */
export const getProductImage = (product: Product, index: number = 0): string => {
  if (product.images && product.images[index]) {
    return buildImageUrl(product.images[index]);
  }
  if (product.image) {
    return buildImageUrl(product.image);
  }
  return '/placeholder.svg';
};

/**
 * Get product category name
 */
export const getProductCategory = (product: Product): string => {
  return product.category?.name || 'Uncategorized';
};

/**
 * Get product brand name
 */
export const getProductBrand = (product: Product): string => {
  return product.brand?.name || '';
};

/**
 * Get product color name
 */
export const getProductColor = (product: Product): string => {
  return product.color?.name || product.colorName || '';
};

/**
 * Check if product is in stock
 */
export const isProductInStock = (product: Product): boolean => {
  return product.stock > 0;
};

/**
 * Build full image URL from relative path
 */
export const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with a slash, it's already a path
  if (imagePath.startsWith('/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // Otherwise, add the base URL
  return `${BASE_URL}/${imagePath}`;
}; 