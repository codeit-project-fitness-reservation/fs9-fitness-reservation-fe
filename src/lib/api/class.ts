import { apiClient, QueryParams } from '../api';

export interface ClassStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface ClassItem {
  id: string;
  createdAt: string;
  title: string;
  pricePoints: number;
  capacity: number;
  status: string;
  center: {
    id: string;
    name: string;
  };
  _count: {
    reservations: number;
  };
}

export interface ClassListResponse {
  data: ClassItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const classApi = {
  getStats: () =>
    apiClient.get('/api/classes/stats') as Promise<{ success: boolean; data: ClassStats }>,
  getClasses: (params?: QueryParams) =>
    apiClient.get('/api/classes', { params }) as Promise<{
      success: boolean;
      data: ClassListResponse;
    }>,
  approveClass: (id: string) =>
    apiClient.patch(`/api/classes/${id}/approve`, {}) as Promise<{
      success: boolean;
      data: ClassItem;
    }>,
  rejectClass: (id: string, reason: string) =>
    apiClient.patch(`/api/classes/${id}/reject`, { rejectReason: reason }) as Promise<{
      success: boolean;
      data: ClassItem;
    }>,
};
