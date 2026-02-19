import { apiClient } from '../api';
import { Review } from '@/types';

export interface CreateReviewData {
  reservationId: string;
  rating: number;
  content: string;
  images?: File[];
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

export const reviewApi = {
  getReviewsByClass: (classId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<ReviewListResponse>(`/api/classes/${classId}/reviews`, { params }),

  getMyReviews: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ReviewListResponse>('/api/reviews/me', { params }),

  createReview: (data: CreateReviewData) => {
    const formData = new FormData();
    formData.append('reservationId', data.reservationId);
    formData.append('rating', data.rating.toString());
    formData.append('content', data.content);

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return apiClient.post<Review>('/api/reviews', formData);
  },

  deleteReview: (reviewId: string) => apiClient.delete(`/api/reviews/${reviewId}`),
};
