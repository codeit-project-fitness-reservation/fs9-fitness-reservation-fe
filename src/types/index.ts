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
  couponCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- [2. Notification] ---
export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body?: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
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

  createdAt: Date;
  updatedAt: Date;
}

export interface ClassItem extends Class {
  center: {
    id: string;
    name: string;
  };
  _count: {
    reservations: number;
    reviews?: number;
  };
  displayCapacity?: string;
  statusLabel?: string;
}

// --- [5. Class Slot (Schedule)] ---
export interface ClassSlot {
  id: string;
  classId: string;
  startAt: Date;
  endAt: Date;
  capacity: number;
  currentReservation: number;
  isOpen: boolean;
  createdAt: Date;
}

export interface ScheduleEvent {
  id: string;
  classId: string;
  slotId: string;
  title: string;
  start: Date;
  end: Date;
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
  slotStartAt: Date;
  pricePoints: number;
  couponDiscountPoints?: number;
  paidPoints?: number;
  userCouponId?: string;
  canceledAt?: Date;
  canceledBy?: string;
  cancelNote?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  user?: {
    name: string;
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
    startAt: Date;
    endAt: Date;
    capacity: number;
    _count: {
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
  createdAt: Date;
}

// --- [8. Coupon (NEW)] ---
export interface CouponTemplate {
  id: string;
  centerId?: string;
  name: string;
  discountPoints: number;
  discountPercentage: number;
  expiresAt?: Date;
  createdAt: Date;
}

export interface UserCoupon {
  id: string;
  userId: string;
  templateId: string;
  issuedAt: Date;
  usedAt?: Date;
  template?: CouponTemplate;
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
  createdAt: Date;
  userNickname?: string;
  userProfileImg?: string;
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
  createdAt: Date;
}
