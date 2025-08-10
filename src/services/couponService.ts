import axios from 'axios';
import { BASE_URL, COMPANY_ID } from './config';

// Create a new axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-company-id': COMPANY_ID,
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  expirationDate: string;
  status: 'active' | 'expired' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidationRequest {
  code: string;
  purchaseAmount: number;
}

export interface CouponValidationResponse {
  coupon: Coupon;
  discountAmount: number;
  finalAmount: number;
}

export interface CouponCreateRequest {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  expirationDate: string;
  status?: 'active' | 'expired' | 'inactive';
}

class CouponService {
  private readonly baseUrl = '/api/coupons';

  /**
   * Create a new coupon (Admin only)
   */
  async createCoupon(couponData: CouponCreateRequest): Promise<Coupon> {
    const response = await api.post(this.baseUrl, couponData);
    return response.data.data;
  }

  /**
   * Get all coupons (Admin only)
   */
  async getCoupons(): Promise<{ count: number; data: Coupon[] }> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  /**
   * Get coupon by ID (Admin only)
   */
  async getCouponById(id: string): Promise<Coupon> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }



  /**
   * Validate a coupon code
   */
  async validateCoupon(validationData: CouponValidationRequest): Promise<CouponValidationResponse> {
    const response = await api.post(`${this.baseUrl}/validate`, validationData);
    return response.data.data;
  }

  /**
   * Remove an applied coupon by ID
   */
  async removeAppliedCoupon(couponId: string): Promise<void> {
   const response =  await api.delete(`${this.baseUrl}/user/${couponId}`);
    return response.data
  }
}

export const couponService = new CouponService();
