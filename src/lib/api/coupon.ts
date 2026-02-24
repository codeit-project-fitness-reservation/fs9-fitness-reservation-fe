import { apiClient } from '../api';

/**
 * 쿠폰 관련 타입 정의
 */

export type DiscountType = 'AMOUNT' | 'PERCENTAGE';
export interface CreateCouponTemplateInput {
  name: string;
  discountType: 'AMOUNT' | 'PERCENTAGE';
  usageValue: number;
  expiresAt: Date | string;
}

export interface CouponTemplate {
  id: string;
  name: string;
  discountType?: DiscountType;
  usageValue?: number;
  /** API 응답 형식: 금액 할인 시 사용 */
  discountPoints?: number | null;
  /** API 응답 형식: 비율 할인 시 사용 */
  discountPercentage?: number | null;
  expiresAt: string | null; // ISO 8601
  issuerId?: string;
  centerId?: string | null;
  createdAt?: string;
}

export interface UserCoupon {
  id: string;
  userId: string;
  templateId: string | null;
  couponName: string;
  discountPoints: number | null;
  discountPercentage: number | null;
  expiresAt: string | null;
  issuedAt: string;
  usedAt: string | null;
}

export interface CreateCouponData {
  name: string;
  discountType: DiscountType;
  usageValue: number;
  expiresAt?: string; // ISO 8601
}

export type UpdateCouponData = Partial<CreateCouponData>;

export interface IssueCouponData {
  userId?: string;
  nickname?: string;
  templateId: string;
}

/**
 * 쿠폰 API 객체
 */
export const couponApi = {
  /** [판매자/관리자] 쿠폰 템플릿 생성 */
  createCouponTemplate: async (data: CreateCouponData) => {
    return apiClient.post('/api/coupons', data);
  },

  /** [판매자/관리자] 내가 만든 쿠폰 목록 조회 */
  getCouponTemplates: async (): Promise<CouponTemplate[]> => {
    return apiClient.get<CouponTemplate[]>('/api/coupons');
  },

  /** [판매자/관리자] 쿠폰 지급 (특정 유저에게 발급) */
  issueCoupon: async (data: IssueCouponData) => {
    return apiClient.post('/api/coupons/give', data);
  },

  /** [본인/관리자] 특정 유저 쿠폰함 조회 */
  getUserCoupons: async (userId: string): Promise<UserCoupon[]> => {
    return apiClient.get<UserCoupon[]>(`/api/coupons/user/${userId}`);
  },

  /** [판매자/관리자] 쿠폰 템플릿 수정 */
  updateCouponTemplate: async (id: string, data: UpdateCouponData) => {
    return apiClient.put(`/api/coupons/${id}`, data);
  },

  /** [판매자/관리자] 쿠폰 템플릿 삭제 */
  deleteCouponTemplate: async (id: string) => {
    return apiClient.delete(`/api/coupons/${id}`);
  },
};
  discountPoints?: number | null;
  discountPercentage?: number | null;
  expiresAt?: string | null;
  issuerId: string;
  createdAt: string;
  _count?: {
    userCoupons: number;
  };
}

export const couponApi = {
  // 쿠폰 템플릿 생성
  createCouponTemplate: async (data: CreateCouponTemplateInput) => {
    // apiClient는 이미 response.data를 반환하므로 .data 접근 불필요
    return apiClient.post<CouponTemplate, CreateCouponTemplateInput>('/api/coupons', data);
  },

  // 내가 만든 쿠폰 목록 조회
  getMyCoupons: async () => {
    // authFetch가 { data: ... } 구조를 자동으로 벗겨서 반환하므로 배열 타입 지정
    return apiClient.get<CouponTemplate[]>('/api/coupons');
  },

  // 유저에게 쿠폰 지급
  giveUserCoupon: async (userId: string, templateId: string) => {
    return apiClient.post<{ id: string; issuedAt: string }, { userId: string; templateId: string }>(
      '/api/coupons/give',
      { userId, templateId },
    );
  },

  // [관리자] 쿠폰 템플릿 수정
  updateCoupon: async (id: string, data: Partial<CreateCouponTemplateInput>) => {
    return apiClient.put<CouponTemplate, Partial<CreateCouponTemplateInput>>(
      `/api/coupons/${id}`,
      data,
    );
  },

  // [관리자] 쿠폰 템플릿 삭제
  deleteCoupon: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/api/coupons/${id}`);
  },

  // [관리자/유저] 특정 유저의 보유 쿠폰 조회
  getUserCoupons: async (userId: string) => {
    return apiClient.get<UserCoupon[]>(`/api/coupons/user/${userId}`);
  },
};

export interface UserCoupon {
  id: string;
  userId: string;
  templateId: string | null;
  // 발급 시점 스냅샷 필드 (템플릿이 삭제되어도 유지됨)
  couponName: string;
  discountPoints: number | null;
  discountPercentage: number | null;
  expiresAt: string | null;
  issuedAt: string;
  usedAt: string | null;
}
