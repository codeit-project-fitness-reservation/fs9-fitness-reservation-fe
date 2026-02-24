import { apiClient } from '../api';

export interface MeResponse {
  id: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  nickname: string;
  email?: string;
  phone?: string;
  profileImage?: string | null;
  profileImgUrl?: string | null; // API 응답 필드명 (profileImgUrl도 지원)
}

export interface SellerProfileUpdateRequest {
  nickname?: string;
  phone?: string;
  password?: string;
  profileImage?: File;
  // 센터 정보 (백엔드 updateSellerProfile에서 함께 처리)
  centerName?: string;
  address1?: string;
  address2?: string;
  introduction?: string;
}

export const authApi = {
  me: () => apiClient.get<MeResponse>('/api/auth/me'),

  // 판매자 프로필 수정 (센터 정보 포함)
  updateSellerProfile: (data: FormData | SellerProfileUpdateRequest) =>
    apiClient.put<MeResponse>('/api/auth/seller/me', data),
};
