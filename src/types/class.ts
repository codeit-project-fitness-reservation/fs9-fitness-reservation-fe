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
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewCount?: number;
  currentReservation?: number;
}

export interface ClassSlot {
  id: string;
  classId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  currentReservation: number;
  isOpen: boolean;
  createdAt: string;
}
