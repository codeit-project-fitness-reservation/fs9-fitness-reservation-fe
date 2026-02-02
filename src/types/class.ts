// 백엔드 스키마 기반 타입 정의

export enum ClassStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Class {
  id: string;
  centerId: string;
  title: string;
  category: string;
  level: string;
  description: string | null;
  notice: string | null;
  pricePoints: number;
  capacity: number;
  bannerUrl: string | null;
  imgUrls: string[];
  status: ClassStatus;
  rejectReason: string | null;
  createdAt: string; // ISO DateTime string
  updatedAt: string; // ISO DateTime string
  // UI 표시용 필드 (별도 API에서 가져올 수 있음)
  rating?: number;
  reviewCount?: number;
}

export interface ClassSlot {
  id: string;
  classId: string;
  startAt: string; // ISO DateTime string
  endAt: string; // ISO DateTime string
  capacity: number;
  currentReservation: number; // DEFAULT 0, 현재 예약 인원
  isOpen: boolean;
  createdAt: string; // ISO DateTime string
}
