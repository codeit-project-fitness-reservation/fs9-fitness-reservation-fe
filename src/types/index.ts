// --- [1. User & Auth] ---
export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  password?: string;
  nickname: string;
  phone: string;
  role: UserRole;
  profileImgUrl?: string | null;
  introduction?: string | null;
  pointBalance: number;
  couponCount?: number;
  createdAt: string;
  updatedAt: string;
  reservationCount?: number;
  reviewCount?: number;
  note?: string | null;
}

// --- [2. Notification] ---
export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body?: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

// --- [3. Center] ---
export interface Center {
  id: string;
  ownerId: string;
  name: string;
  address1: string;
  address2?: string;
  introduction?: string;
  profileImgUrl?: string;
  businessHours?: Record<string, unknown>;
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
}

// --- [4. Class] ---
export type ClassStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Class {
  id: string;
  centerId: string;
  title: string;
  category: string;
  level: string;
  description?: string;
  notice?: string;
  pricePoints: number;
  capacity: number;
  bannerUrl?: string;
  imgUrls: string[];
  status: ClassStatus;
  rejectReason?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ClassItem extends Class {
  center: {
    id: string;
    name: string;
  };
  _count?: {
    reviews?: number;
  };
  displayCapacity?: string;
  statusLabel?: string;
}

// --- [5. Class Slot (Schedule)] ---
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

export interface ScheduleEvent {
  id: string;
  classId: string;
  slotId: string;
  title: string;
  start: string;
  end: string;
  resource?: {
    className: string;
    category: string;
    level: string;
    capacity: number;
    currentReservations: number;
    maxCapacity: number;
    isOpen: boolean;
    instructor?: string;
  };
}

// --- [6. Reservation] ---
export type ReservationStatus = 'BOOKED' | 'CANCELED' | 'COMPLETED';

export interface Reservation {
  id: string;
  userId: string;
  classId: string;
  slotId: string;
  status: ReservationStatus;
  slotStartAt: string;
  pricePoints: number;
  couponDiscountPoints?: number;
  paidPoints?: number;
  userCouponId?: string;
  canceledAt?: string | null;
  canceledBy?: UserRole | null;
  cancelNote?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;

  user?: {
    nickname: string;
    email: string;
    phone: string;
  };
  class?: {
    title: string;
    center?: {
      name: string;
    };
  };
  slot?: {
    startAt: string;
    endAt: string;
    capacity: number;
    _count?: {
      reservations: number;
    };
  };
}

// --- [7. Point History (NEW)] ---
export type PointUsed = 'CHARGE' | 'USE' | 'REFUND' | 'ADMIN';

export interface PointHistory {
  id: string;
  userId: string;
  type: PointUsed;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reservationId?: string;
  orderId?: string;
  paymentKey?: string;
  createdAt: string;
}

// --- [8. Coupon (NEW)] ---
export interface CouponTemplate {
  id: string;
  issuerId: string;
  centerId?: string | null;
  name: string;
  discountPoints: number | null;
  discountPercentage: number | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface UserCoupon {
  id: string;
  userId: string;
  templateId: string | null;
  // 발급 시점 스냅샷 필드 (템플릿 삭제 후에도 유지)
  couponName: string;
  discountPoints: number | null;
  discountPercentage: number | null;
  expiresAt: string | null;
  issuedAt: string;
  usedAt: string | null;
}

// --- [9. Review (NEW)] ---
export interface Review {
  id: string;
  reservationId: string;
  userId: string;
  classId: string;
  rating: number;
  content?: string;
  imgUrls: string[];
  createdAt: string;
  userNickname?: string;
  userProfileImg?: string;
  user?: {
    id: string;
    nickname: string;
    profileImgUrl?: string | null;
  };
}

// --- [10. Sales (매출)] ---
export interface SalesSummary {
  totalRevenue: number;
  couponDiscount: number;
  refundAmount: number;
  netRevenue: number;
}

export interface ClassSales {
  id: string;
  classId: string;
  title: string;
  imageUrl?: string;
  revenue: number;
}

export interface SalesTransaction {
  id: string;
  classId: string;
  className: string;
  status: 'BOOKED' | 'CANCELED';
  statusLabel: string;
  dateTime: string;
  amount: number;
  createdAt: string;
}
