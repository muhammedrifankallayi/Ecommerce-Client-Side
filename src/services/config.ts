// export const BASE_URL = "http://localhost:5000";
export const BASE_URL = "https://api.thefitfive.store";

// Company ID configuration - can be overridden by environment variable
export const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || "691d3c23eb1f60306db7dd55";

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
  variants: "/api/variants",
  landingUi: "/api/front-config",
}; 