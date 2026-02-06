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
  getStats: () => apiClient.get<ClassStats>('/api/classes/stats'),
  getClasses: (params?: QueryParams) =>
    apiClient.get<ClassListResponse>('/api/classes', { params }),
  createClass: (data: FormData) => apiClient.post<void>('/api/classes', data),
  approveClass: (id: string) => apiClient.patch<ClassItem>(`/api/classes/${id}/approve`, {}),
  rejectClass: (id: string, reason: string) =>
    apiClient.patch<ClassItem>(`/api/classes/${id}/reject`, { rejectReason: reason }),
};
