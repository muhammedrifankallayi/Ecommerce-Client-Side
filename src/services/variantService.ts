import { apiService } from './api';
import { ENDPOINTS } from './config';
import { VariantInfo } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export interface VariantResponse extends ApiResponse<VariantInfo> {}
export interface VariantsResponse extends ApiResponse<{
  data: VariantInfo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {}

export interface CreateVariantDto {
  name: string;
  type: string;
  values: string[];
}

export class VariantService {
  private basePath = ENDPOINTS.variants;

  async getVariants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<VariantsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `${this.basePath}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get(endpoint);
  }

  async getVariantById(id: string): Promise<VariantResponse> {
    return apiService.get(`${this.basePath}/${id}`);
  }

  async createVariant(data: CreateVariantDto): Promise<VariantResponse> {
    return apiService.post(this.basePath, data);
  }
}

export const variantService = new VariantService(); 