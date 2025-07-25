
import { apiService } from './api';
import { ApiResponse, User, UpdateUserProfile, Address } from '@/types/api';

export class UserService {
  private basePath = '/users';

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<ApiResponse<User>>(`${this.basePath}/me`);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiService.get<ApiResponse<User>>(`${this.basePath}/${id}`);
  }

  async updateProfile(id: string, profile: UpdateUserProfile): Promise<ApiResponse<User>> {
    return apiService.put<ApiResponse<User>>(`${this.basePath}/${id}`, profile);
  }

  async uploadAvatar(id: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiService.post<ApiResponse<{ avatarUrl: string }>>(`${this.basePath}/${id}/avatar`, formData);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  // Address management
  async getUserAddresses(userId: string): Promise<ApiResponse<Address[]>> {
    return apiService.get<ApiResponse<Address[]>>(`${this.basePath}/${userId}/addresses`);
  }

  async addAddress(userId: string, address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    return apiService.post<ApiResponse<Address>>(`${this.basePath}/${userId}/addresses`, address);
  }

  async updateAddress(userId: string, addressId: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return apiService.put<ApiResponse<Address>>(`${this.basePath}/${userId}/addresses/${addressId}`, address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.basePath}/${userId}/addresses/${addressId}`);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<ApiResponse<Address>> {
    return apiService.put<ApiResponse<Address>>(`${this.basePath}/${userId}/addresses/${addressId}/default`, {});
  }
}

export const userService = new UserService();
