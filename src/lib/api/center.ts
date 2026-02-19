import { apiClient } from '../api';

export interface CenterItem {
  id: string;
  ownerId: string;
  name: string;
  address1: string;
  address2: string | null;
  introduction: string | null;
  businessHours?: Record<string, unknown> | null;
  lat?: number | null;
  lng?: number | null;
  createdAt: string;
  updatedAt: string;

  owner: {
    nickname: string;
    phoneNumber: string | null; // 연락처
    profileImage: string | null; // 프로필 이미지
  };
}

export const centerApi = {
  getMyCenter: () => apiClient.get<CenterItem>('/api/centers/me'),

  updateCenter: (id: string, data: FormData | Record<string, string>) =>
    apiClient.patch<CenterItem>(`/api/centers/${id}`, data),
};
