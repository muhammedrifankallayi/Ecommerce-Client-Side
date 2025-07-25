
import { apiService } from './api';
import { ENDPOINTS } from './config';
import { CartItem } from '@/types/api';

export class CartService {
  private basePath = ENDPOINTS.cart;

  async getCart() {
    return apiService.get(this.basePath);
  }

  async addToCart(productId: string, quantity: number, inventoryId: string) {
    return apiService.post(this.basePath, {
      productId,
      quantity,
      inventoryId
    });
  }

  async removeFromCart(itemId: string) {
    return apiService.delete(`${this.basePath}/${itemId}`);
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    return apiService.put(`${this.basePath}/${itemId}`, { quantity });
  }

  async clearCart() {
    return apiService.delete(this.basePath);
  }
}

export const cartService = new CartService();
