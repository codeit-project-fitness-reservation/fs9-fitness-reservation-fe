import { apiClient } from '../api';

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  phone: string;
  profileImgUrl: string | null;
  introduction: string | null;
  pointBalance: number;
  createdAt: string;
  updatedAt: string;
}

export const userApi = {
  getMyProfile: () => apiClient.get<UserProfile>('/api/users/me'),

  updateProfile: (data: FormData | Record<string, string>) =>
    apiClient.patch<UserProfile>('/api/users/me', data),
};
