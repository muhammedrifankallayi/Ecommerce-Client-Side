import { apiService } from './api';
import { ENDPOINTS } from './config';

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

export class BrandService {
  private basePath = ENDPOINTS.brands || '/brands';
  private publicBasePath = '/api/public/brands';

  async getBrands(): Promise<Brand[]> {
    const endpoint = isAuthenticated() ? this.basePath : this.publicBasePath;
    const response = await apiService.get(endpoint);
    // Handle both public and private API response shapes
    if (response && Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data.brands)) {
      return response.data.brands;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  async getBrandById(id: string): Promise<Brand> {
    const endpoint = isAuthenticated() ? `${this.basePath}/${id}` : `${this.publicBasePath}/${id}`;
    return apiService.get(endpoint);
  }

  async createBrand(brand: Omit<Brand, '_id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
    return apiService.post(this.basePath, brand);
  }

  async updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
    return apiService.put(`${this.basePath}/${id}`, brand);
  }

  async deleteBrand(id: string): Promise<void> {
    return apiService.delete(`${this.basePath}/${id}`);
  }
}

export const brandService = new BrandService(); 