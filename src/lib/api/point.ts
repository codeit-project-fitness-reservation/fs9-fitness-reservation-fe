import { apiClient, buildQueryParams } from '../api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type PointTransactionType = 'CHARGE' | 'USE' | 'REFUND' | 'ADMIN';
export type SettlementTransactionType = 'USE' | 'REFUND';

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
  type: PointTransactionType;
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

export interface SettlementSummary {
  totalRevenue: number;
  couponDiscount: number;
  refundAmount: number;
  netRevenue: number;
}

export interface SettlementByClass {
  classId: string;
  classTitle: string;
  bannerUrl: string | null;
  totalRevenue: number;
}

export interface SellerSettlementResponse {
  period: {
    year: number;
    month: number;
  };
  summary: SettlementSummary;
  byClass: SettlementByClass[];
}

export interface SettlementTransactionItem {
  id: string;
  type: SettlementTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  reservation: {
    id: string;
    status: string;
    class: {
      id: string;
      title: string;
      bannerUrl: string | null;
    };
  };
}

export interface SellerTransactionResponse {
  data: SettlementTransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- 4. Point API Methods ---

export const pointApi = {
  // [고객] 내 포인트 잔액 및 내역
  getMyBalance: () => apiClient.get<PointBalance>('/api/points/me'),

  getMyHistory: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PointHistoryResponse>('/api/points/me/history', {
      params: buildQueryParams(params),
    }),

  charge: (data: ChargePointRequest) => apiClient.post<PointBalance>('/api/points/charge', data),

  // [고객] 토스 승인 + 포인트 충전
  chargeConfirm: (data: ChargePointRequest) =>
    apiClient.post<PointBalance>('/api/points/charge/confirm', data),

  // [판매자] 매출 정산 요약 + 클래스별 매출
  getSellerSettlement: (params: { year: number; month: number }) => {
    return apiClient.get<SellerSettlementResponse>('/api/points/seller/settlement', {
      params: buildQueryParams(params),
    });
  },

  getSellerTransactions: (params: {
    year: number;
    month: number;
    classId?: string;
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<SellerTransactionResponse>('/api/points/seller/transactions', {
      params: buildQueryParams(params),
    });
  },

  // [관리자] 포인트 조정 및 내역 관리
  adjustPoint: (data: AdjustPointInput) => apiClient.post('/api/points/admin/adjust', data),

  getHistory: (params: { page?: number; limit?: number; userId?: string }) =>
    apiClient.get('/api/points/admin/history', {
      params: buildQueryParams(params),
    }),
};
