import { apiClient, buildQueryParams } from '../api';
import type { Reservation } from '@/types';

export interface AdminReservationListResponse {
  data: Reservation[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// --- 1. 가용한 모든 예약 상태 정의 (Union Type) ---
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED' | 'BOOKED';

// --- 2. 검색 파라미터 (HEAD의 확장된 필드 유지) ---
export interface ReservationSearchParams {
  page?: number | string;
  limit?: number | string;
  size?: number | string;
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  searchType?: string;
  keyword?: string;
  skip?: number | string;
  take?: number | string;
  userId?: string;
  classId?: string;
  slotId?: string;
}

// --- 3. 데이터 모델 (중복 제거 및 통합) ---
export interface ReservationDetail {
  id: string;
  userId: string;
  classId: string;
  slotId: string;
  status: ReservationStatus;
  slotStartAt: string;
  pricePoints: number;
  couponDiscountPoints?: number;
  paidPoints?: number;
  canceledAt?: string | null;
  canceledBy?: string | null;
  cancelNote?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  class: {
    id: string;
    title: string;
    pricePoints?: number;
    center: {
      id: string;
      name: string;
      ownerId?: string;
      address1?: string;
      address2?: string | null;
    };
  };
  slot: {
    id: string;
    startAt: string;
    endAt: string;
    capacity: number;
    currentReservation?: number;
    _count?: {
      reservations: number;
    };
  };
  user?: {
    id: string;
    nickname: string;
    email?: string;
    phone?: string;
  };
  userCoupon?: {
    id: string;
    discountPoints?: number;
    discountPercentage?: number;
    template?: { name: string };
  } | null;
}

export interface ReservationListResponse {
  data: ReservationDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/** 통계 데이터 인터페이스 통합 */
export interface ReservationStats {
  period: { startDate: string; endDate: string };
  totalReservations: number;
  statusBreakdown: Record<ReservationStatus, number>;
  dailyReservations?: Array<{ date: string; count: number }>;
  totalRevenue?: number;
  totalRefund?: number;
}

export interface CreateReservationRequest {
  slotId: string;
  userCouponId?: string;
}

// --- 4. API Methods ---

export const reservationApi = {
  /** [Customer] 유저 본인 예약 관련 */
  getMyReservations: (params?: { status?: ReservationStatus; page?: number; limit?: number }) =>
    apiClient.get<ReservationListResponse>('/api/reservations', {
      params: buildQueryParams(params as Record<string, string | number | undefined>),
    }),

  getReservationDetail: (id: string) => apiClient.get<ReservationDetail>(`/api/reservations/${id}`),

  createReservation: (data: CreateReservationRequest) =>
    apiClient.post<ReservationDetail>('/api/reservations', data),

  cancelReservation: (id: string, cancelNote?: string) =>
    apiClient.patch<void>(`/api/reservations/${id}/cancel`, { cancelNote }),

  /** [Admin] 관리자 예약 목록 */
  getAdminReservations: (params?: ReservationSearchParams) => {
    const queryParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams[key] = value;
      });
    }
    return apiClient.get<AdminReservationListResponse>('/api/reservations/admin/reservations', {
      params: queryParams,
    });
  },

  /** [Seller] 판매자 전용 */
  getSellerReservationDetail: (id: string) =>
    apiClient.get<ReservationDetail>(`/api/reservations/seller/reservations/${id}`),

  cancelReservationBySeller: (id: string, cancelNote?: string) =>
    apiClient.patch<void>(`/api/reservations/seller/reservations/${id}/cancel`, {
      cancelNote: cancelNote || null,
    }),

  /** [Admin] 통계 조회 */
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ReservationStats> => {
    return apiClient.get<ReservationStats>('/api/reservations/admin/reservations/stats', {
      params: buildQueryParams(params as Record<string, string | number | undefined>),
    });
  },
};
