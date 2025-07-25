
import { apiService } from './api';
import { ENDPOINTS } from './config';
import { Order, OrderItemPayload, OrderShippingAddress } from '@/types/api';
import { ApiResponse } from '@/types/api';

export interface CreateOrderPayload {
  orderItems: OrderItemPayload[];
  shippingAddress: OrderShippingAddress;
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

export interface OrdersListResponse {
  orders: Order[];
  page: number;
  pages: number;
  total: number;
}

export class OrderService {
  private basePath = ENDPOINTS.orders;

  async createOrder(orderData: CreateOrderPayload) {
    const response = await apiService.post<Order>(this.basePath, orderData);
    return {
      success: true,
      data: response as Order
    } as ApiResponse<Order>;
  }

  async getOrders(filters?: { page?: number; limit?: number; status?: string }) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const response = await apiService.post<OrdersListResponse>(
      `${this.basePath}/list-by-user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,{}
    );
    return {
      success: true,
      data: response
    } as ApiResponse<OrdersListResponse>;
  }

  async getOrderById(orderId: string) {
    const response = await apiService.get<Order>(`${this.basePath}/${orderId}`);
    return {
      success: true,
      data: response as Order
    } as ApiResponse<Order>;
  }

  async cancelOrder(orderId: string) {
    const response = await apiService.put<Order>(`${this.basePath}/${orderId}/cancel`);
    return {
      success: true,
      data: response as Order
    } as ApiResponse<Order>;
  }
}

export const orderService = new OrderService();
