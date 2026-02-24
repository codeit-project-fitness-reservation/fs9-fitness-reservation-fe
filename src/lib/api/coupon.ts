import { apiClient } from '../api';

export type DiscountType = 'AMOUNT' | 'PERCENTAGE';

export interface CouponTemplate {
  id: string;
  name: string;
  discountType: DiscountType;
  discountPoints: number | null;
  discountPercentage: number | null;
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
  couponName: string;
  discountPoints: number | null;
  discountPercentage: number | null;
  expiresAt: string | null;
  issuedAt: string;
  usedAt: string | null;
}

export interface CreateCouponInput {
  name: string;
  discountType: DiscountType;
  usageValue: number;
  expiresAt?: string;
}

export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface IssueCouponInput {
  userId?: string;
  nickname?: string;
  templateId: string;
}

export const couponApi = {
  createCouponTemplate: async (data: CreateCouponInput) => {
    return apiClient.post<CouponTemplate, CreateCouponInput>('/api/coupons', data);
  },
  getCouponTemplates: async (): Promise<CouponTemplate[]> => {
    return apiClient.get<CouponTemplate[]>('/api/coupons');
  },
  issueCoupon: async (data: IssueCouponInput) => {
    return apiClient.post<{ id: string; issuedAt: string }, IssueCouponInput>(
      '/api/coupons/give',
      data,
    );
  },
  getUserCoupons: async (userId: string): Promise<UserCoupon[]> => {
    return apiClient.get<UserCoupon[]>(`/api/coupons/user/${userId}`);
  },
  updateCouponTemplate: async (id: string, data: UpdateCouponInput) => {
    return apiClient.put<CouponTemplate, UpdateCouponInput>(`/api/coupons/${id}`, data);
  },
  deleteCouponTemplate: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/api/coupons/${id}`);
  },
};
