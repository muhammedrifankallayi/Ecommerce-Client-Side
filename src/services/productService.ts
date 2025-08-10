
import { apiService } from './api';
import { ENDPOINTS } from './config';
import { Product, Inventory } from '@/types';
import { ApiResponse, PaginatedResponse, ProductFilters } from '@/types/api';

function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

export interface ProductWithInventory extends Product {
  success: boolean;
  data: Product;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export class ProductService {
  private basePath = ENDPOINTS.products;
  private publicBasePath = '/api/public/products';

  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `${isAuthenticated() ? this.basePath : this.publicBasePath}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<ProductsResponse>(endpoint);
  }

  async getProductById(id: string): Promise<ProductWithInventory> {
    const endpoint = isAuthenticated() ? `${this.basePath}/${id}` : `${this.publicBasePath}/${id}`;
    return apiService.get<ProductWithInventory>(endpoint);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // No public endpoint for featured, fallback to private
    const response = await apiService.get<{ products: Product[] }>(`${this.basePath}/featured`);
    return response.products;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const endpoint = isAuthenticated()
      ? `${this.basePath}/search?q=${encodeURIComponent(query)}`
      : `${this.publicBasePath}?search=${encodeURIComponent(query)}`;
    const response = await apiService.get<{ products: Product[] }>(endpoint);
    return response.products;
  }

  async getRelatedProducts(productId: string): Promise<Product[]> {
    // No public endpoint for related, fallback to private
    const response = await apiService.get<{ products: Product[] }>(`${this.basePath}/${productId}/related`);
    return response.products;
  }

  async createProduct(product: Omit<Product, '_id'>): Promise<Product> {
    return apiService.post<Product>(this.basePath, product);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return apiService.put<Product>(`${this.basePath}/${id}`, product);
  }

  async deleteProduct(id: string): Promise<void> {
    return apiService.delete<void>(`${this.basePath}/${id}`);
  }
}

export const productService = new ProductService();
