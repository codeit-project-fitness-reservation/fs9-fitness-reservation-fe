import { apiClient } from '../api';
import type { Reservation } from '@/types';

export interface AdminReservationListResponse {
  data: Reservation[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface ReservationSearchParams {
  page?: string;
  limit?: string;
  size?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  searchType?: string;
  keyword?: string;
  userId?: string;
}

export interface ReservationStats {
  totalReservations: number;
  statusBreakdown: {
    BOOKED: number;
    CANCELED: number;
    COMPLETED: number;
  };
}

export interface ReservationDetail {
  id: string;
  userId?: string;
  classId: string;
  slotId: string;
  status: 'BOOKED' | 'CANCELED' | 'COMPLETED';
  slotStartAt: string;
  pricePoints: number;
  couponDiscountPoints?: number;
  paidPoints?: number;
  createdAt: string;
  updatedAt: string;
  canceledAt?: string | null;
  completedAt?: string | null;
  class: {
    id: string;
    title: string;
    center: {
      id: string;
      name: string;
      address1: string;
      address2?: string | null;
    };
  };
  slot: {
    id: string;
    startAt: string;
    endAt: string;
    capacity: number;
    _count: {
      reservations: number;
    };
  };
}

export interface ReservationListResponse {
  data: ReservationDetail[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateReservationRequest {
  classId: string;
  slotId: string;
  couponId?: string;
  usedPoints?: number;
  requestNote?: string;
}

export const reservationApi = {
  // Customer용
  getMyReservations: (params?: { status?: string; page?: number; limit?: number }) => {
    const queryParams: Record<string, string> = {};
    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.page !== undefined) {
      queryParams.page = String(params.page);
    }
    if (params?.limit !== undefined) {
      queryParams.limit = String(params.limit);
    }
    return apiClient.get<ReservationListResponse>('/api/reservations', { params: queryParams });
  },

  getReservationDetail: (id: string) => apiClient.get<ReservationDetail>(`/api/reservations/${id}`),

  createReservation: (data: CreateReservationRequest) =>
    apiClient.post<ReservationDetail>('/api/reservations', data),

  cancelReservation: (id: string, cancelNote?: string) =>
    apiClient.patch<void>(`/api/reservations/${id}/cancel`, { cancelNote }),

  // Admin용
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

  cancelReservationByAdmin: async (id: string, cancelNote: string) => {
    return apiClient.delete(`/api/reservations/admin/reservations/${id}`, { cancelNote });
  },

  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ReservationStats> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    return apiClient.get<ReservationStats>('/api/reservations/admin/reservations/stats', {
      params: queryParams,
    });
  },
};
