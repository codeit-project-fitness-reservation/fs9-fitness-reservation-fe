import { apiClient } from '../api';

export interface AdjustPointInput {
  userId: string;
  amount: number;
  memo: string;
}

export interface PointBalance {
  pointBalance: number;
}

export interface PointHistoryItem {
  id: string;
  type: 'CHARGE' | 'USE' | 'REFUND' | 'ADMIN';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reservationId?: string | null;
  orderId?: string | null;
  paymentKey?: string | null;
  memo?: string | null;
  createdAt: string;
}

export interface PointHistoryResponse {
  data: PointHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ChargePointRequest {
  amount: number;
  paymentKey: string;
  orderId: string;
}

export const pointApi = {
  getMyBalance: () => apiClient.get<PointBalance>('/api/points/me'),

  getMyHistory: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PointHistoryResponse>('/api/points/me/history', { params }),

  charge: (data: ChargePointRequest) => apiClient.post<PointBalance>('/api/points/charge', data),

  adjustPoint: (data: AdjustPointInput) => apiClient.post('/api/points/admin/adjust', data),

  getHistory: (params: { page?: number; limit?: number; userId?: string }) =>
    apiClient.get('/api/points/admin/history', { params }),
};
