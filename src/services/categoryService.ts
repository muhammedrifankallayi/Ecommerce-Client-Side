
import { apiService } from './api';
import { ENDPOINTS } from './config';
import { Category } from '@/types';

function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

export class CategoryService {
  private basePath = ENDPOINTS.categories;
  private publicBasePath = '/api/public/categories';

  async getCategories(): Promise<Category[]> {
    const endpoint = isAuthenticated() ? this.basePath : this.publicBasePath;
    const response = await apiService.get(endpoint);
    // Handle both public and private API response shapes
    if (response && Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data.categories)) {
      return response.data.categories;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  async getCategoryById(id: string): Promise<Category> {
    const endpoint = isAuthenticated() ? `${this.basePath}/${id}` : `${this.publicBasePath}/${id}`;
    return apiService.get(endpoint);
  }

  async createCategory(category: Omit<Category, '_id'>): Promise<Category> {
    return apiService.post(this.basePath, category);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return apiService.put(`${this.basePath}/${id}`, category);
  }

  async deleteCategory(id: string): Promise<void> {
    return apiService.delete(`${this.basePath}/${id}`);
  }
}

export const categoryService = new CategoryService();
