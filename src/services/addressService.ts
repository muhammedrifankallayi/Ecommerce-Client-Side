import { apiService } from './api';
import { COMPANY_ID } from './config';
import { UserAddress, AddressRequest, AddressResponse } from '@/types/api';

export class AddressService {
  private basePath = '/api/addresses';

  async getAddresses(): Promise<UserAddress[]> {
    const res = await apiService.get(this.basePath);
    return Array.isArray(res.data) ? res.data : [];
  }

  async addAddress(address: AddressRequest): Promise<UserAddress> {
    const res = await apiService.post(this.basePath, address);
    return res.data as UserAddress;
  }

  async getAddress(id: string): Promise<UserAddress> {
    const res = await apiService.get(`${this.basePath}/${id}`);
    return res.data as UserAddress;
  }

  async updateAddress(id: string, address: AddressRequest): Promise<UserAddress> {
    const res = await apiService.put(`${this.basePath}/${id}`, address);
    return res.data as UserAddress;
  }

  async deleteAddress(id: string): Promise<void> {
    await apiService.delete(`${this.basePath}/${id}`);
  }

  async setDefaultAddress(id: string): Promise<UserAddress> {
    const res = await apiService.put(`${this.basePath}/${id}/default`, {});
    return res.data as UserAddress;
  }
}

export const addressService = new AddressService(); 