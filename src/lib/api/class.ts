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
  description: string;
  notice?: string | null;
  category: string;
  level: string;
  bannerUrl?: string | null;
  imgUrls?: string[];
  schedule?: string | null; // 반복 스케줄 (JSON 문자열, 예: { "화목": "19:00", "월수금": "10:00, 19:00" })
  center: {
    id: string;
    name: string;
    address1?: string;
    address2?: string;
  };

  _count: {
    reservations: number;
    reviews: number;
  };
}

export interface ClassListResponse {
  data: ClassItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SlotItemResponse {
  id: string;
  startAt: string | Date;
  endAt: string | Date;
  capacity: number; // 총 정원
  currentReservations?: number;
  currentReservation?: number;

  _count?: {
    reservations: number;
  };
  isAvailable?: boolean;
  isOpen?: boolean;
  classId: string;
  class?: {
    id: string;
    classId: string;
  };
  createdAt?: string | Date;
}

export interface SlotItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  currentReservations: number;
  isAvailable: boolean;
  classId: string;
}
export interface ReservationItem {
  id: string;
  classId: string;
  classTitle: string;
  user: {
    id: string;
    name: string;
    nickname?: string;
    phoneNumber: string;
    profileImgUrl?: string | null;
  };
  reservationDate: string;
  slotStartAt?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED' | 'BOOKED';
  createdAt: string;
  canceledAt?: string | null;
  completedAt?: string | null;
  // 결제 정보
  pricePoints?: number;
  paidPoints?: number;
  couponDiscountPoints?: number;
  payment?: {
    method: 'CARD';
    pointsUsed: number;
    couponDiscount?: number;
    paymentId: string;
    orderNumber: string;
  };
}
export interface ReservationListResponse {
  data: ReservationItem[];
  total: number;
  page: number;
  limit: number;
}

// [판매자] 매출 정산 요약 인터페이스
export interface SettlementSummary {
  totalRevenue: number;
  couponDiscount: number;
  refundAmount: number;
  netRevenue: number;
}

export interface SettlementByClass {
  classId: string;
  classTitle: string;
  bannerUrl: string | null;
  totalRevenue: number;
}

export interface SellerSettlementResponse {
  period: {
    year: number;
    month: number;
  };
  summary: SettlementSummary;
  byClass: SettlementByClass[];
}

// [판매자] 상세 거래 내역 인터페이스
export interface SettlementTransactionItem {
  id: string;
  type: 'USE' | 'REFUND';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  reservation: {
    id: string;
    status: string;
    class: {
      id: string;
      title: string;
      bannerUrl: string | null;
    };
  };
}

export interface SellerTransactionResponse {
  data: SettlementTransactionItem[];
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
  updateClass: (id: string, data: FormData) => apiClient.patch<void>(`/api/classes/${id}`, data),
  deleteClass: (id: string) => apiClient.delete<void>(`/api/classes/${id}`),
  getClassDetail: (id: string) => apiClient.get<ClassItem>(`/api/classes/${id}`),
  rejectClass: (id: string, reason: string) =>
    apiClient.patch<ClassItem>(`/api/classes/${id}/reject`, { rejectReason: reason }),

  getSellerSlots: (params: QueryParams) =>
    apiClient.get<SlotItemResponse[]>('/api/reservations/seller/slots', { params }),

  getSellerReservations: (params: QueryParams) =>
    apiClient.get<ReservationListResponse>('/api/reservations/seller/reservations', { params }),

  getSellerReservationDetail: (id: string) =>
    apiClient.get<ReservationItem>(`/api/reservations/seller/reservations/${id}`),

  cancelReservationBySeller: (id: string) =>
    apiClient.patch<void>(`/api/reservations/seller/reservations/${id}/cancel`, {}),

  getSellerSettlement: (params: { year: number; month: number }) =>
    apiClient.get<SellerSettlementResponse>('/api/points/seller/settlement', { params }),
  getSellerTransactions: (params: {
    year: number;
    month: number;
    classId?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<SellerTransactionResponse>('/api/points/seller/transactions', { params }),
};
