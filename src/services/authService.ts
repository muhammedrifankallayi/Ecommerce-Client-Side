
import { apiService } from './api';
import { ENDPOINTS } from './config';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  type: string;
  isEmailVerified: boolean;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: User & { token: string };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

class AuthService {
  // Register a new user
  async register(data: RegisterData): Promise<RegisterResponse> {
    return apiService.post(`${ENDPOINTS.auth}/register`, data);
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return apiService.get(`${ENDPOINTS.auth}/verify-email?token=${token}`);
  }

  // Resend verification email
  async resendVerification(data: ResendVerificationData): Promise<VerifyEmailResponse> {
    return apiService.post(`${ENDPOINTS.auth}/resend-verification`, data);
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    return apiService.post(`${ENDPOINTS.auth}/login`, data);
  }

  // Get current user profile
  async getCurrentUser(): Promise<ProfileResponse> {
    return apiService.get(`${ENDPOINTS.auth}/me`);
  }

  // Get user profile
  async getUserProfile(): Promise<ProfileResponse> {
    return apiService.get('/users/profile/me');
  }

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    return apiService.put('/users/profile/me', data);
  }
}

export const authService = new AuthService();
