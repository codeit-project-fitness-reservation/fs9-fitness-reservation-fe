import { apiClient } from '../api';

export interface Review {
  id: string;
  reservationId: string;
  userId: string;
  classId: string;
  rating: number;
  content?: string;
  imgUrls: string[];
  createdAt: string;
  user?: { nickname: string; profileImgUrl?: string };
  class?: { title: string; category: string };
}

export const reviewApi = {
  getCenterReviews: async (centerId: string, params?: { skip?: number; take?: number }) => {
    return apiClient.get<Review[]>(`/api/reviews/center/${centerId}`, { params });
  },
};
