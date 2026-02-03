import { apiClient } from './client';

export interface ReservationSearchParams {
  page?: string;
  size?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  searchType?: string;
  keyword?: string;
  skip?: string;
  take?: string;
}

export const reservationApi = {
  getAdminReservations: async (params?: ReservationSearchParams) => {
    const queryParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams[key] = value;
      });
    }
    return apiClient.get('/reservations/admin/reservations', { params: queryParams });
  },

  getReservationDetail: async (id: string) => {
    return apiClient.get(`/reservations/${id}`);
  },

  cancelReservation: async (id: string, cancelNote: string) => {
    return apiClient.delete(`/reservations/admin/reservations/${id}`, {
      body: JSON.stringify({ cancelNote }),
      headers: { 'Content-Type': 'application/json' },
    });
  },

  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const queryParams: Record<string, string> = {};
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    return apiClient.get('/reservations/admin/reservations/stats', { params: queryParams });
  },
};
