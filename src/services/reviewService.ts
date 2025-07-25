import { apiService } from './api';
import { ENDPOINTS } from './config';
import { uploadService } from './uploadService';

export interface Review {
  _id: string;
  productId: string | { _id: string; name: string; images: string[] };
  userId: string | { _id: string; name: string };
  companyId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isHelpful: number;
  helpfulUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ReviewListResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: ReviewPagination;
    stats: ReviewStats;
  };
  message?: string;
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
  message?: string;
}

class ReviewService {
  // Create a new review (first upload images, then send URLs)
  async createReview({
    productId,
    companyId,
    rating,
    title,
    comment,
    images
  }: {
    productId: string;
    companyId: string;
    rating: number;
    title: string;
    comment: string;
    images?: File[];
  }): Promise<ReviewResponse> {
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      imageUrls = await uploadService.uploadImages(images);
    }
    // Send review with image URLs (not files)
    return apiService.post('/api/reviews', {
      productId,
      companyId,
      rating,
      title,
      comment,
      images: imageUrls,
    });
  }

  // Get reviews for a product (with pagination)
  async getProductReviews(productId: string, page = 1, limit = 10, sort = '-createdAt'): Promise<ReviewListResponse> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), sort });
    return apiService.get(`/api/reviews/product/${productId}?${params.toString()}`);
  }

  // Mark review as helpful
  async markHelpful(reviewId: string): Promise<any> {
    return apiService.post(`/api/reviews/${reviewId}/helpful`);
  }

  // Update a review
  async updateReview(reviewId: string, {
    rating,
    title,
    comment,
    images
  }: {
    rating?: number;
    title?: string;
    comment?: string;
    images?: File[];
  }): Promise<ReviewResponse> {
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      imageUrls = await uploadService.uploadImages(images);
    }
    return apiService.put(`/api/reviews/${reviewId}`, {
      rating,
      title,
      comment,
      images: imageUrls,
    });
  }

  // Delete a review
  async deleteReview(reviewId: string): Promise<any> {
    return apiService.delete(`/api/reviews/${reviewId}`);
  }
}

export const reviewService = new ReviewService(); 