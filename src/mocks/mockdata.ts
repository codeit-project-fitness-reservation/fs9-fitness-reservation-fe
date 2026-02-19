import {
  User,
  NotificationItem,
  Center,
  ScheduleEvent,
  SalesSummary,
  ClassSales,
  SalesTransaction,
  ClassItem,
} from '@/types';
import { Class, ClassStatus } from '@/types/class';
export const MOCK_ACCOUNTS: Record<string, User> = {
  'user@test.com': {
    id: 'user-1',
    email: 'user@test.com',
    nickname: '홍길동',
    phone: '010-1234-5678',
    role: 'CUSTOMER',
    password: 'password123',
    pointBalance: 10000,
    couponCount: 2,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-20'),
  },
  'seller@test.com': {
    id: 'seller-1',
    email: 'seller@test.com',
    nickname: '김강사',
    phone: '010-9876-5432',
    role: 'SELLER',
    password: 'sellerpassword',
    pointBalance: 0,
    couponCount: 0,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-20'),
  },
  'admin@test.com': {
    id: 'admin-1',
    email: 'admin@test.com',
    nickname: '최고관리자',
    phone: '010-0000-0000',
    role: 'ADMIN',
    password: 'adminpassword',
    pointBalance: 0,
    couponCount: 0,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-20'),
  },
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'noti-1',
    userId: 'seller-1',
    title: '새로운 예약이 신청되었습니다.',
    body: '초급 필라테스 클래스에 새로운 예약이 있습니다.',
    isRead: false,
    createdAt: new Date('2026-01-19'),
  },
  {
    id: 'noti-2',
    userId: 'seller-1',
    title: '시스템 점검 안내입니다.',
    body: '2026년 1월 25일 새벽 2시~4시 시스템 점검이 예정되어 있습니다.',
    isRead: true,
    createdAt: new Date('2026-01-18'),
  },
];

// 판매자 센터 정보
export const MOCK_SELLER_CENTER: Center = {
  id: 'center-1',
  ownerId: 'seller-1',
  name: '김강사 휘트니스',
  address1: '서울시 강남구 테헤란로 123',
  address2: '2층',
  introduction: '건강한 삶을 위한 최고의 선택, 김강사 휘트니스입니다.',
  businessHours: {
    monday: '06:00-22:00',
    tuesday: '06:00-22:00',
    wednesday: '06:00-22:00',
    thursday: '06:00-22:00',
    friday: '06:00-22:00',
    saturday: '08:00-18:00',
    sunday: '08:00-18:00',
  },
  lat: 37.5012,
  lng: 127.0396,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-15'),
};

// 판매자 클래스 목록
export const MOCK_SELLER_CLASSES: ClassItem[] = [
  {
    id: 'class-1',
    centerId: 'center-1',
    title: '30분 근력 운동',
    category: '헬스',
    level: '초급',
    description: '전신 근력을 강화하는 30분 집중 운동 프로그램',
    notice: '운동화와 수건을 지참해주세요.',
    pricePoints: 1200,
    capacity: 10,
    bannerUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'APPROVED',
    displayCapacity: '7/10',
    center: {
      id: 'center-1',
      name: '강남 피트니스 센터',
    },
    _count: {
      reservations: 7,
      reviews: 12,
    },
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'class-2',
    centerId: 'center-1',
    title: '힐링 요가 클래스',
    category: '요가',
    level: '입문',
    description: '마음의 평화와 몸의 균형을 찾는 힐링 요가',
    notice: '요가 매트는 센터에서 제공됩니다.',
    pricePoints: 950,
    capacity: 12,
    bannerUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'PENDING',
    statusLabel: '대기중',
    displayCapacity: '0/12',
    center: {
      id: 'center-1',
      name: '강남 피트니스 센터',
    },
    _count: {
      reservations: 0,
      reviews: 0,
    },
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: 'class-3',
    centerId: 'center-1',
    title: '아침 스트레칭',
    category: '필라테스',
    level: '초급',
    description: '상쾌한 아침을 시작하는 전신 스트레칭',
    pricePoints: 800,
    capacity: 8,
    imgUrls: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'REJECTED',
    statusLabel: '반려됨',
    rejectReason:
      '이미지 해상도가 기준에 미달합니다. 최소 1920x1080 이상의 이미지를 업로드해주세요.',
    displayCapacity: '0/8',
    center: {
      id: 'center-1',
      name: '강남 피트니스 센터',
    },
    _count: {
      reservations: 0,
      reviews: 0,
    },
    createdAt: new Date('2026-01-17'),
    updatedAt: new Date('2026-01-19'),
  },
];
// 판매자 스케줄 (오늘의 스케줄) - ClassSlot 기반
export const MOCK_SELLER_SCHEDULES: ScheduleEvent[] = [
  {
    id: 'slot-1',
    classId: 'class-1',
    slotId: 'slot-1',
    title: ' 근력 운동',
    start: new Date(2026, 0, 22, 12, 0),
    end: new Date(2026, 0, 22, 13, 0),
    resource: {
      className: '근력 운동',
      category: '헬스',
      level: '초급',
      capacity: 10,
      currentReservations: 8,
      maxCapacity: 10,
      isOpen: true,
    },
  },
  {
    id: 'slot-2',
    classId: 'class-1',
    slotId: 'slot-2',
    title: '30분 근력 운동',
    start: new Date(2026, 0, 21, 14, 30),
    end: new Date(2026, 0, 21, 15, 30),
    resource: {
      className: '30분 근력 운동',
      category: '헬스',
      level: '초급',
      capacity: 10,
      currentReservations: 5,
      maxCapacity: 10,
      isOpen: true,
    },
  },
  {
    id: 'slot-5',
    classId: 'class-2',
    slotId: 'slot-5',
    title: '힐링 요가 클래스',
    start: new Date(2026, 0, 23, 18, 0),
    end: new Date(2026, 0, 23, 19, 30),
    resource: {
      className: '힐링 요가 클래스',
      category: '요가',
      level: '입문',
      capacity: 12,
      currentReservations: 6,
      maxCapacity: 12,
      isOpen: true,
    },
  },
  {
    id: 'slot-7',
    classId: 'class-1',
    slotId: 'slot-7',
    title: '60분 근력 운동',
    start: new Date(2026, 0, 24, 11, 0),
    end: new Date(2026, 0, 24, 12, 0),
    resource: {
      className: '30분 근력 운동',
      category: '헬스',
      level: '초급',
      capacity: 10,
      currentReservations: 3,
      maxCapacity: 10,
      isOpen: true,
    },
  },
];

// 클래스 목록용 Mock 데이터
export const MOCK_CLASS_LIST: Class[] = [
  {
    id: 'class-1',
    centerId: 'center-1',
    title: '30분 순환 근력 운동',
    category: '헬스',
    level: '입문',
    description:
      '짧은 시간 안에 전신 근육을 고르게 사용하는 순환형 근력 클래스입니다.\n웨이트와 맨몸 동작을 번갈아 진행해 운동 효율을 높이고 체력과 근력을 동시에 강화할 수 있어요.\n운동 초보자도 따라올 수 있도록 동작 난이도를 조절하며, 바쁜 일상 속에서도 30분으로 확실한 운동 효과를 느낄 수 있습니다.',
    notice: '운동화와 수건을 지참해주세요.',
    pricePoints: 24000,
    capacity: 30,
    bannerUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    ],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-01-20').toISOString(),
    rating: 4.5,
    reviewCount: 18,
    currentReservation: 5,
  },
  {
    id: 'class-2',
    centerId: 'center-1',
    title: '60분 요가 클래스',
    category: '요가',
    level: '초급',
    description: '전신 스트레칭과 호흡법을 통해 몸과 마음을 정화하는 요가 클래스입니다.',
    notice: '요가 매트를 지참해주세요.',
    pricePoints: 30000,
    capacity: 20,
    bannerUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    ],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date('2026-01-10').toISOString(),
    updatedAt: new Date('2026-01-19').toISOString(),
    rating: 4.8,
    reviewCount: 32,
    currentReservation: 12,
  },
  {
    id: 'class-3',
    centerId: 'center-1',
    title: '45분 필라테스',
    category: '필라테스',
    level: '중급',
    description: '코어 강화와 자세 교정에 중점을 둔 필라테스 클래스입니다.',
    notice: '편안한 운동복을 착용해주세요.',
    pricePoints: 35000,
    capacity: 15,
    bannerUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    ],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date('2026-01-12').toISOString(),
    updatedAt: new Date('2026-01-18').toISOString(),
    rating: 4.7,
    reviewCount: 25,
    currentReservation: 8,
  },
  {
    id: 'class-4',
    centerId: 'center-1',
    title: '90분 하체 집중 운동',
    category: '헬스',
    level: '고급',
    description: '하체 근육을 집중적으로 단련하는 고강도 운동 클래스입니다.',
    notice: '충분한 수분 섭취를 권장합니다.',
    pricePoints: 40000,
    capacity: 12,
    bannerUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    ],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date('2026-01-08').toISOString(),
    updatedAt: new Date('2026-01-17').toISOString(),
    rating: 4.9,
    reviewCount: 45,
    currentReservation: 10,
  },
  {
    id: 'class-5',
    centerId: 'center-1',
    title: '30분 스트레칭',
    category: '요가',
    level: '입문',
    description: '일상의 피로를 풀어주는 가벼운 스트레칭 클래스입니다.',
    notice: null,
    pricePoints: 15000,
    capacity: 25,
    bannerUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    ],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date('2026-01-14').toISOString(),
    updatedAt: new Date('2026-01-21').toISOString(),
    rating: 4.3,
    reviewCount: 12,
    currentReservation: 3,
  },
  {
    id: 'class-6',
    centerId: 'center-1',
    title: '60분 상체 근력 운동',
    category: '헬스',
    level: '중급',
    description: '상체 근육을 균형있게 발달시키는 근력 운동 클래스입니다.',
    notice: '운동화 필수 지참',
    pricePoints: 32000,
    capacity: 18,
    bannerUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    ],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date('2026-01-11').toISOString(),
    updatedAt: new Date('2026-01-19').toISOString(),
    rating: 4.6,
    reviewCount: 28,
    currentReservation: 15,
  },
  {
    id: 'class-7',
    centerId: 'center-1',
    title: '75분 복합 운동',
    category: '헬스',
    level: '고급',
    description: '유산소와 근력 운동을 결합한 종합 운동 클래스입니다.',
    notice: '운동 전 2시간 전 식사 권장',
    pricePoints: 45000,
    capacity: 10,
    bannerUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    imgUrls: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    ],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date('2026-01-09').toISOString(),
    updatedAt: new Date('2026-01-16').toISOString(),
    rating: 4.4,
    reviewCount: 20,
    currentReservation: 7,
  },
];

// 클래스 상세 페이지용 Mock 데이터
export const MOCK_CLASS_DETAIL: Class = {
  id: 'class-1',
  centerId: 'center-1',
  title: '30분 순환 근력 운동',
  category: '헬스',
  level: '입문',
  description:
    '짧은 시간 안에 전신 근육을 고르게 사용하는 순환형 근력 클래스입니다.\n웨이트와 맨몸 동작을 번갈아 진행해 운동 효율을 높이고 체력과 근력을 동시에 강화할 수 있어요.\n운동 초보자도 따라올 수 있도록 동작 난이도를 조절하며, 바쁜 일상 속에서도 30분으로 확실한 운동 효과를 느낄 수 있습니다.',
  notice: '운동화와 수건을 지참해주세요.',
  pricePoints: 24000,
  capacity: 30,
  bannerUrl:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  imgUrls: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  ],
  status: ClassStatus.APPROVED,
  rejectReason: null,
  createdAt: new Date('2026-01-15').toISOString(),
  updatedAt: new Date('2026-01-20').toISOString(),
  rating: 4.5,
  reviewCount: 18,
  currentReservation: 5,
};

// 매출 정산 데이터
export const MOCK_SALES_SUMMARY: SalesSummary = {
  totalRevenue: 420000,
  couponDiscount: 10000,
  refundAmount: 10000,
  netRevenue: 400000,
};

export const MOCK_CLASS_SALES: ClassSales[] = [
  {
    id: 'cs-1',
    classId: 'class-1',
    title: '30분 근력 운동',
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    revenue: 200000,
  },
  {
    id: 'cs-2',
    classId: 'class-2',
    title: '힐링 요가 클래스',
    imageUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    revenue: 220000,
  },
];

export const MOCK_SALES_TRANSACTIONS: SalesTransaction[] = [
  // ===== 2025년 12월 거래 =====
  {
    id: 'st-2025-12-1',
    classId: 'class-1',
    className: '30분 근력 운동',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2025.12.05. 10:00',
    amount: 50000,
    createdAt: new Date('2025-12-05T10:00:00'),
  },
  {
    id: 'st-2025-12-2',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2025.12.10. 18:00',
    amount: 40000,
    createdAt: new Date('2025-12-10T18:00:00'),
  },
  {
    id: 'st-2025-12-3',
    classId: 'class-1',
    className: '30분 근력 운동',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2025.12.15. 14:00',
    amount: 50000,
    createdAt: new Date('2025-12-15T14:00:00'),
  },
  {
    id: 'st-2025-12-4',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2025.12.20. 19:00',
    amount: 40000,
    createdAt: new Date('2025-12-20T19:00:00'),
  },
  {
    id: 'st-2025-12-5',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'CANCELED',
    statusLabel: '환불',
    dateTime: '2025.12.25. 18:00',
    amount: -40000,
    createdAt: new Date('2025-12-25T18:00:00'),
  },

  // ===== 2026년 1월 거래 (총 매출 420,000원) =====
  {
    id: 'st-1',
    classId: 'class-1',
    className: '30분 근력 운동',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.02. 10:00',
    amount: 50000,
    createdAt: new Date('2026-01-02T10:00:00'),
  },
  {
    id: 'st-2',
    classId: 'class-1',
    className: '30분 근력 운동',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.05. 14:00',
    amount: 50000,
    createdAt: new Date('2026-01-05T14:00:00'),
  },
  {
    id: 'st-3',
    classId: 'class-1',
    className: '30분 근력 운동',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.10. 11:00',
    amount: 50000,
    createdAt: new Date('2026-01-10T11:00:00'),
  },
  {
    id: 'st-4',
    classId: 'class-1',
    className: '30분 근력 운동',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.15. 16:00',
    amount: 50000,
    createdAt: new Date('2026-01-15T16:00:00'),
  },
  // 힐링 요가 클래스 거래 (총 220,000원)
  {
    id: 'st-5',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.03. 18:00',
    amount: 40000,
    createdAt: new Date('2026-01-03T18:00:00'),
  },
  {
    id: 'st-6',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.06. 19:00',
    amount: 40000,
    createdAt: new Date('2026-01-06T19:00:00'),
  },
  {
    id: 'st-7',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.08. 18:30',
    amount: 40000,
    createdAt: new Date('2026-01-08T18:30:00'),
  },
  {
    id: 'st-8',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.12. 17:00',
    amount: 40000,
    createdAt: new Date('2026-01-12T17:00:00'),
  },
  {
    id: 'st-9',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.16. 19:30',
    amount: 40000,
    createdAt: new Date('2026-01-16T19:30:00'),
  },
  {
    id: 'st-10',
    classId: 'class-2',
    className: '힐링 요가 클래스',
    status: 'BOOKED',
    statusLabel: '완료',
    dateTime: '2026.01.20. 18:00',
    amount: 20000,
    createdAt: new Date('2026-01-20T18:00:00'),
  },
  // 취소/환불 (총 10,000원)
  {
    id: 'st-11',
    classId: 'class-1',
    className: '30분 근력 운동',
    status: 'CANCELED',
    statusLabel: '환불',
    dateTime: '2026.01.18. 14:00',
    amount: -50000,
    createdAt: new Date('2026-01-18T14:00:00'),
  },
];

// 리뷰 Mock 데이터
export interface MockReview {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: 'review-1',
    classId: 'class-1',
    userId: 'user-1',
    userName: '홍길동',
    rating: 5,
    content: '운동을 처음 해봤는데 강사님께서 친절하게 알려주셔서 편하게 할 수 있었어요.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    ],
    createdAt: '2025.01.10',
  },
  {
    id: 'review-2',
    classId: 'class-1',
    userId: 'user-2',
    userName: '홍길동',
    rating: 5,
    content: '운동을 처음 해봤는데 강사님께서 친절하게 알려주셔서 편하게 할 수 있었어요.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    ],
    createdAt: '2025.01.10',
  },
  {
    id: 'review-3',
    classId: 'class-1',
    userId: 'user-3',
    userName: '홍길동',
    rating: 5,
    content:
      '혼자 운동할 때보다 훨씬 집중돼요. 시간 맞춰 진행되니까 흐트러지지 않고 끝까지 하게 돼요.',
    createdAt: '2025.01.10',
  },
];

// 참여자 Mock 데이터
export const MOCK_PARTICIPANTS = [
  {
    id: 'reservation-1',
    classId: 'class-1',
    classTitle: '30분 근력 운동',
    user: {
      id: 'user-1',
      name: '홍길동',
      phoneNumber: '010-1234-5678',
      profileImgUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-01-24T12:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-01-20T10:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 40000,
      couponDiscount: 10000,
      paymentId: 'R123',
      orderNumber: '12345',
    },
  },
  {
    id: 'reservation-2',
    classId: 'class-1',
    classTitle: '30분 근력 운동',
    user: {
      id: 'user-2',
      name: '김민지',
      phoneNumber: '010-2345-6789',
      profileImgUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-01-24T12:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-01-21T11:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 35000,
      couponDiscount: 5000,
      paymentId: 'R124',
      orderNumber: '12346',
    },
  },
  {
    id: 'reservation-3',
    classId: 'class-1',
    classTitle: '30분 근력 운동',
    user: {
      id: 'user-3',
      name: '박수아',
      phoneNumber: '010-3456-7890',
      profileImgUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-01-24T12:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-01-22T09:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 45000,
      paymentId: 'R125',
      orderNumber: '12347',
    },
  },
  {
    id: 'reservation-4',
    classId: 'class-1',
    classTitle: '30분 근력 운동',
    user: {
      id: 'user-4',
      name: '정상훈',
      phoneNumber: '010-4567-8901',
      profileImgUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-01-24T12:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-01-23T14:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 50000,
      couponDiscount: 15000,
      paymentId: 'R126',
      orderNumber: '12348',
    },
  },
  {
    id: 'reservation-5',
    classId: 'class-1',
    classTitle: '30분 근력 운동',
    user: {
      id: 'user-5',
      name: '홍길동',
      phoneNumber: '010-5678-9012',
      profileImgUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-01-24T12:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-01-23T15:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 30000,
      paymentId: 'R127',
      orderNumber: '12349',
    },
  },
  {
    id: 'reservation-6',
    classId: 'class-1',
    classTitle: '30분 근력 운동',
    user: {
      id: 'user-6',
      name: '이영희',
      phoneNumber: '010-6789-0123',
      profileImgUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-01-24T12:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-01-23T16:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 40000,
      couponDiscount: 8000,
      paymentId: 'R128',
      orderNumber: '12350',
    },
  },
  // 2026-02-09 10:00 시간대 참여자 (매트 필라테스용)
  {
    id: 'reservation-7',
    classId: 'class-1',
    classTitle: '매트 필라테스',
    user: {
      id: 'user-7',
      name: '최지영',
      phoneNumber: '010-7890-1234',
      profileImgUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-02-09T10:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-02-05T10:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 35000,
      paymentId: 'R129',
      orderNumber: '12351',
    },
  },
  {
    id: 'reservation-8',
    classId: 'class-1',
    classTitle: '매트 필라테스',
    user: {
      id: 'user-8',
      name: '강민수',
      phoneNumber: '010-8901-2345',
      profileImgUrl:
        'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-02-09T10:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-02-06T11:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 40000,
      couponDiscount: 10000,
      paymentId: 'R130',
      orderNumber: '12352',
    },
  },
  {
    id: 'reservation-9',
    classId: 'class-1',
    classTitle: '매트 필라테스',
    user: {
      id: 'user-9',
      name: '윤서연',
      phoneNumber: '010-9012-3456',
      profileImgUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces',
    },
    reservationDate: new Date('2026-02-09T10:00:00').toISOString(),
    status: 'CONFIRMED' as const,
    createdAt: new Date('2026-02-07T09:00:00').toISOString(),
    payment: {
      method: 'CARD' as const,
      pointsUsed: 45000,
      couponDiscount: 5000,
      paymentId: 'R131',
      orderNumber: '12353',
    },
  },
];
