// --- [1. User & Auth] ---
export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string; // ERD: String id PK
  email: string;
  password?: string; // 해시된 비밀번호 (보안상 프론트엔드에는 안 넘어올 수 있음)
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
// 앞선 Header 컴포넌트 에러를 해결하기 위해 구조를 맞춤
export interface NotificationItem {
  id: string; // ERD에 맞춰 number -> string 변경 (UUID 권장)
  userId: string;
  title: string; // 알림 제목 (예: 예약 확정)
  body?: string; // 알림 내용 (예: 00수업이 예약되었습니다) - UI의 'message' 역할
  linkUrl?: string; // 클릭 시 이동할 링크
  isRead: boolean; // ERD엔 없지만 UI 필수 필드 (DB에 추가 권장)
  createdAt: Date; // UI의 'date' 역할
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
  businessHours?: Record<string, unknown>; // JSON 타입 대응
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

// 판매자/사용자 목록용 확장 타입 (UI 전용)
export interface ClassItem extends Class {
  center: {
    id: string;
    name: string;
  };
  _count: {
    reservations: number;
    reviews?: number;
  };
  // UI 전용 가공 필드 (필요시 사용)
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
  currentReservation: number; // ERD 반영: 현재 예약 인원
  isOpen: boolean;
  createdAt: Date;
}

// 캘린더 라이브러리(FullCalendar)용 이벤트 객체
export interface ScheduleEvent {
  id: string;
  classId: string;
  slotId: string;
  title: string;
  start: Date;
  end: Date;
  // FullCalendar의 extendedProps에 들어갈 추가 정보
  resource?: {
    className: string;
    category: string;
    level: string;
    capacity: number;
    currentReservations: number;
    maxCapacity: number;
    isOpen: boolean;
    instructor?: string; // 강사명 (User 정보 조인 필요 시)
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
  slotStartAt: Date; // 중복 예약 방지용 시간 스냅샷
  pricePoints: number;
  couponDiscountPoints?: number;
  paidPoints?: number; // 실제 결제(차감)된 포인트
  userCouponId?: string;
  canceledAt?: Date;
  canceledBy?: string; // 'USER' | 'SELLER' | 'ADMIN'
  cancelNote?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  // UI 표시용 (조인 데이터 - API 응답에 포함될 경우)
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
export type PointTransactionType = 'CHARGE' | 'USE' | 'REFUND' | 'ADMIN';

export interface PointHistory {
  id: string;
  userId: string;
  type: PointTransactionType;
  amount: number; // 변동량 (+/-)
  balanceBefore: number;
  balanceAfter: number;
  reservationId?: string;
  orderId?: string; // 결제 주문 ID
  paymentKey?: string; // PG사 결제 키
  memo?: string;
  createdAt: Date;
}

// --- [8. Coupon (NEW)] ---
export interface CouponTemplate {
  id: string;
  centerId?: string; // null이면 전체 플랫폼 쿠폰
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
  usedAt?: Date; // null이면 미사용

  // 조인해서 가져올 템플릿 정보 (Optional)
  template?: CouponTemplate;
}

// --- [9. Review (NEW)] ---
export interface Review {
  id: string;
  reservationId: string;
  userId: string;
  classId: string;
  rating: number; // 1~5
  content?: string;
  imgUrls: string[];
  createdAt: Date;

  // UI 표시용 (조인 데이터)
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
