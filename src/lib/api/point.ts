import { apiClient } from '../api';

export interface AdjustPointInput {
  userId: string;
  amount: number;
  memo: string;
}

export const pointApi = {
  // 관리자 포인트 지급/회수
  adjustPoint: (data: AdjustPointInput) => {
    return apiClient.post('/api/points/admin/adjust', data);
  },

  // 관리자 포인트 내역 조회
  getHistory: (params: { page?: number; limit?: number; userId?: string }) => {
    return apiClient.get('/api/points/admin/history', { params });
  },
};
