import { apiClient, QueryParams } from '../api';
import { Reservation } from '@/types';

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

  _count?: {
    reviews?: number;
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
  capacity: number;
  currentReservations?: number;
  currentReservation?: number;

  _count?: {
    reservations: number;
  };
  isAvailable?: boolean;
  isOpen?: boolean;
  classId?: string;
  class?: {
    id: string;
    classId: string;
  };
  createdAt?: string | Date;
}

export interface ClassDetailResponse extends ClassItem {
  slots?: SlotItemResponse[];
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
  status: 'BOOKED' | 'CANCELED' | 'COMPLETED';
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

export const classApi = {
  getStats: () => apiClient.get<ClassStats>('/api/classes/stats'),
  getClasses: (params?: QueryParams) =>
    apiClient.get<ClassListResponse>('/api/classes', { params }),
  createClass: (data: FormData) => apiClient.post<void>('/api/classes', data),
  approveClass: (id: string) => apiClient.patch<ClassItem>(`/api/classes/${id}/approve`, {}),
  updateClass: (id: string, data: FormData) => apiClient.patch<void>(`/api/classes/${id}`, data),
  deleteClass: (id: string) => apiClient.delete<void>(`/api/classes/${id}`),
  getClassDetail: (id: string) => apiClient.get<ClassDetailResponse>(`/api/classes/${id}`),
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
};
