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

export interface CenterReviewResponse {
  reviews: Review[];
  pagination: {
    totalCount: number;
    totalPage: number;
    currentPage: number;
    limit: number;
  };
}

export const reviewApi = {
  // [공통] 센터별 리뷰 목록 조회
  getCenterReviews: async (centerId: string, params?: { page?: number; limit?: number }) => {
    return apiClient.get<CenterReviewResponse>(`/api/reviews/center/${centerId}`, { params });
  },

  // [공통] 클래스별 리뷰 목록 조회
  getReviewsByClass: (classId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<CenterReviewResponse>(`/api/reviews/class/${classId}`, { params }),

  // [고객] 특정 예약의 내 리뷰 조회
  getMyReviewByReservation: (reservationId: string) =>
    apiClient.get<Review | null>(`/api/reviews/my/${reservationId}`),

  // [고객] 리뷰 생성
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

  // [고객] 리뷰 삭제
  deleteReview: (reviewId: string) => apiClient.delete(`/api/reviews/${reviewId}`),
};
