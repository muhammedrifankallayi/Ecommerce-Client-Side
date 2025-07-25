
import { apiService } from './api';
import { ApiResponse, WishlistItem } from '@/types/api';
import { Product } from '@/types';

export class WishlistService {
  private basePath = '/wishlist';

  async getWishlist(userId: string): Promise<ApiResponse<(WishlistItem & { product: Product })[]>> {
    return apiService.get<ApiResponse<(WishlistItem & { product: Product })[]>>(`${this.basePath}/${userId}`);
  }

  async addToWishlist(userId: string, productId: number): Promise<ApiResponse<WishlistItem>> {
    return apiService.post<ApiResponse<WishlistItem>>(this.basePath, { userId, productId });
  }

  async removeFromWishlist(userId: string, productId: number): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.basePath}/${userId}/${productId}`);
  }

  async isInWishlist(userId: string, productId: number): Promise<ApiResponse<boolean>> {
    return apiService.get<ApiResponse<boolean>>(`${this.basePath}/${userId}/${productId}/check`);
  }

  async clearWishlist(userId: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.basePath}/${userId}`);
  }
}

export const wishlistService = new WishlistService();
