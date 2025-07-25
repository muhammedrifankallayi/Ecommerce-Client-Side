
import { apiService } from './api';
import { ApiResponse } from '@/types/api';
import { Banner } from '@/types/api';

export class BannerService {
  private basePath = '/banners';

  async getBanners(): Promise<ApiResponse<Banner[]>> {
    return apiService.get<ApiResponse<Banner[]>>(this.basePath);
  }

  async getActiveBanners(): Promise<ApiResponse<Banner[]>> {
    return apiService.get<ApiResponse<Banner[]>>(`${this.basePath}/active`);
  }

  async getBannerById(id: string): Promise<ApiResponse<Banner>> {
    return apiService.get<ApiResponse<Banner>>(`${this.basePath}/${id}`);
  }

  async createBanner(banner: Omit<Banner, 'id'>): Promise<ApiResponse<Banner>> {
    return apiService.post<ApiResponse<Banner>>(this.basePath, banner);
  }

  async updateBanner(id: string, banner: Partial<Banner>): Promise<ApiResponse<Banner>> {
    return apiService.put<ApiResponse<Banner>>(`${this.basePath}/${id}`, banner);
  }

  async deleteBanner(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  async updateBannerOrder(banners: { id: string; order: number }[]): Promise<ApiResponse<void>> {
    return apiService.put<ApiResponse<void>>(`${this.basePath}/order`, { banners });
  }
}

export const bannerService = new BannerService();
