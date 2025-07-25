export const BASE_URL = "http://localhost:5000";

// Company ID configuration - can be overridden by environment variable
export const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || "686e3977d861a6eff15cec67";

export const ENDPOINTS = {
  products: "/api/products",
  categories: "/api/categories",
  users: "/api/users",
  orders: "/api/orders",
  auth: "/api/auth",
  cart: "/api/cart",
  wishlist: "/api/wishlist",
  reviews: "/api/reviews",
  brands: "/api/brands",
  variants: "/api/variants"
}; 