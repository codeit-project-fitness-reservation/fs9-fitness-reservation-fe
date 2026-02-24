import { apiClient } from '../api';

/**
 * 1. 쿠폰 관련 공통 타입 정의
 */
export type DiscountType = 'AMOUNT' | 'PERCENTAGE';

export interface CouponTemplate {
  id: string;
  name: string;
  discountType: DiscountType;
  /** API 응답 형식: 금액 할인(Points) 또는 비율 할인(Percentage) */
  discountPoints: number | null;
  discountPercentage: number | null;
  /** 만료일 (ISO 8601 형식) */
  expiresAt: string | null;
  issuerId?: string;
  centerId?: string | null;
  createdAt?: string;
  _count?: {
    userCoupons: number;
  };
}

export interface UserCoupon {
  id: string;
  userId: string;
  templateId: string | null;
  /** 발급 시점 스냅샷 필드 (템플릿이 삭제되어도 데이터 유지) */
  couponName: string;
  discountPoints: number | null;
  discountPercentage: number | null;
  expiresAt: string | null;
  issuedAt: string;
  usedAt: string | null;
}

/**
 * 2. API 요청 파라미터 타입 정의
 */
export interface CreateCouponInput {
  name: string;
  discountType: DiscountType;
  usageValue: number; // 할인 금액 또는 할인율
  expiresAt?: string; // ISO 8601
}

export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface IssueCouponInput {
  userId?: string;
  nickname?: string;
  templateId: string;
}

/**
 * 3. 쿠폰 API 객체 (통합 및 정밀화)
 */
export const couponApi = {
  /** [판매자/관리자] 쿠폰 템플릿 생성 */
  createCouponTemplate: async (data: CreateCouponInput) => {
    return apiClient.post<CouponTemplate, CreateCouponInput>('/api/coupons', data);
  },

  /** [판매자/관리자] 내가 만든 쿠폰 목록 조회 */
  getCouponTemplates: async (): Promise<CouponTemplate[]> => {
    return apiClient.get<CouponTemplate[]>('/api/coupons');
  },

  /** [판매자/관리자] 쿠폰 지급 (특정 유저에게 발급) */
  issueCoupon: async (data: IssueCouponInput) => {
    return apiClient.post<{ id: string; issuedAt: string }, IssueCouponInput>(
      '/api/coupons/give',
      data,
    );
  },

  /** [본인/관리자] 특정 유저의 보유 쿠폰 조회 */
  getUserCoupons: async (userId: string): Promise<UserCoupon[]> => {
    return apiClient.get<UserCoupon[]>(`/api/coupons/user/${userId}`);
  },

  /** [판매자/관리자] 쿠폰 템플릿 수정 */
  updateCouponTemplate: async (id: string, data: UpdateCouponInput) => {
    return apiClient.put<CouponTemplate, UpdateCouponInput>(`/api/coupons/${id}`, data);
  },

  /** [판매자/관리자] 쿠폰 템플릿 삭제 */
  deleteCouponTemplate: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/api/coupons/${id}`);
  },
};
