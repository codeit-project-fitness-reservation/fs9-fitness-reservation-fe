import { apiClient } from '../api';
import { User } from '@/types';

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

export interface GetUsersParams {
  [key: string]: string | number | undefined;
  page?: number;
  limit?: number;
  role?: string;
  searchType?: 'nickname' | 'email' | 'phone';
  search?: string;
}

export interface GetUsersResponse {
  users: User[];
  totalCount: number;
}

export const userApi = {
  // 내 프로필 조회
  getMyProfile: () => apiClient.get<UserProfile>('/api/auth/me'),

  // [고객] 프로필 수정
  updateCustomerProfile: async (data: FormData | Record<string, string>) => {
    if (data instanceof FormData) {
      return apiClient.put<UserProfile>('/api/auth/customer/me', data);
    }
    return apiClient.put<UserProfile>(
      '/api/auth/customer/me',
      data as unknown as Record<string, unknown>,
    );
  },

  // [판매자] 프로필 수정
  updateSellerProfile: async (data: FormData | Record<string, string>) => {
    if (data instanceof FormData) {
      return apiClient.put<UserProfile>('/api/auth/seller/me', data);
    }
    return apiClient.put<UserProfile>(
      '/api/auth/seller/me',
      data as unknown as Record<string, unknown>,
    );
  },

  getUsers: async (params: GetUsersParams) => {
    return apiClient.get<GetUsersResponse>('/api/users', { params });
  },

  getStats: async () => {
    return apiClient.get<{ total: number; customer: number; seller: number }>('/api/users/stats');
  },

  getUserById: async (userId: string) => {
    return apiClient.get<User>(`/api/users/${userId}`);
  },

  // [관리자] 회원 메모 수정
  patchNote: (userId: string, note: string | null) =>
    apiClient.patch<User>(`/api/users/${userId}/note`, { note }),
};
