import { Reservation, ReservationStatus } from '@/types';

/**
 * Customer 예약 목록 (BOOKED 상태)
 */
export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'reservation-1',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-class-1-20260124-1300',
    status: 'BOOKED' as ReservationStatus,
    slotStartAt: new Date('2026-01-24T13:00:00'),
    pricePoints: 5000,
    couponDiscountPoints: 0,
    paidPoints: 5000,
    createdAt: new Date('2026-01-20T10:00:00'),
    updatedAt: new Date('2026-01-20T10:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
      },
    },
    slot: {
      startAt: new Date('2026-01-24T13:00:00'),
      endAt: new Date('2026-01-24T14:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
  {
    id: 'reservation-2',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-class-1-20260124-1400',
    status: 'BOOKED' as ReservationStatus,
    slotStartAt: new Date('2026-01-24T14:00:00'),
    pricePoints: 5000,
    couponDiscountPoints: 0,
    paidPoints: 5000,
    createdAt: new Date('2026-01-20T11:00:00'),
    updatedAt: new Date('2026-01-20T11:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
      },
    },
    slot: {
      startAt: new Date('2026-01-24T14:00:00'),
      endAt: new Date('2026-01-24T15:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
  {
    id: 'reservation-3',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-class-1-20260124-1500',
    status: 'BOOKED' as ReservationStatus,
    slotStartAt: new Date('2026-01-24T15:00:00'),
    pricePoints: 5000,
    couponDiscountPoints: 0,
    paidPoints: 5000,
    createdAt: new Date('2026-01-20T12:00:00'),
    updatedAt: new Date('2026-01-20T12:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
      },
    },
    slot: {
      startAt: new Date('2026-01-24T15:00:00'),
      endAt: new Date('2026-01-24T16:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
  {
    id: 'reservation-4',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-class-1-20260124-1600',
    status: 'BOOKED' as ReservationStatus,
    slotStartAt: new Date('2026-01-24T16:00:00'),
    pricePoints: 5000,
    couponDiscountPoints: 0,
    paidPoints: 5000,
    createdAt: new Date('2026-01-20T13:00:00'),
    updatedAt: new Date('2026-01-20T13:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
      },
    },
    slot: {
      startAt: new Date('2026-01-24T16:00:00'),
      endAt: new Date('2026-01-24T17:00:00'),
      capacity: 10,
      _count: {
        reservations: 10,
      },
    },
  },
];

/**
 * Customer 수강 내역 (COMPLETED 상태)
 * 정렬 테스트를 위해 다양한 completedAt과 pricePoints 포함
 */
export const MOCK_HISTORY: Reservation[] = [
  {
    id: 'history-1',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-class-1-20260120-1000',
    status: 'COMPLETED' as ReservationStatus,
    slotStartAt: new Date('2026-01-20T10:00:00'),
    pricePoints: 3000,
    couponDiscountPoints: 0,
    paidPoints: 3000,
    createdAt: new Date('2026-01-15T10:00:00'),
    updatedAt: new Date('2026-01-20T11:00:00'),
    completedAt: new Date('2026-01-20T11:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
      },
    },
    slot: {
      startAt: new Date('2026-01-20T10:00:00'),
      endAt: new Date('2026-01-20T11:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
  {
    id: 'history-2',
    userId: 'user-1',
    classId: 'class-2',
    slotId: 'slot-class-2-20260124-1200',
    status: 'COMPLETED' as ReservationStatus,
    slotStartAt: new Date('2026-01-24T12:00:00'),
    pricePoints: 5000,
    couponDiscountPoints: 0,
    paidPoints: 5000,
    createdAt: new Date('2026-01-20T10:00:00'),
    updatedAt: new Date('2026-01-24T13:00:00'),
    completedAt: new Date('2026-01-24T13:00:00'),
    class: {
      title: '요가 클래스',
      center: {
        name: '요가 스튜디오',
      },
    },
    slot: {
      startAt: new Date('2026-01-24T12:00:00'),
      endAt: new Date('2026-01-24T13:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
  {
    id: 'history-3',
    userId: 'user-1',
    classId: 'class-3',
    slotId: 'slot-class-3-20260128-1400',
    status: 'COMPLETED' as ReservationStatus,
    slotStartAt: new Date('2026-01-28T14:00:00'),
    pricePoints: 8000,
    couponDiscountPoints: 0,
    paidPoints: 8000,
    createdAt: new Date('2026-01-25T10:00:00'),
    updatedAt: new Date('2026-01-28T15:00:00'),
    completedAt: new Date('2026-01-28T15:00:00'),
    class: {
      title: '필라테스 클래스',
      center: {
        name: '필라테스 센터',
      },
    },
    slot: {
      startAt: new Date('2026-01-28T14:00:00'),
      endAt: new Date('2026-01-28T15:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
  {
    id: 'history-4',
    userId: 'user-1',
    classId: 'class-4',
    slotId: 'slot-class-4-20260122-1600',
    status: 'COMPLETED' as ReservationStatus,
    slotStartAt: new Date('2026-01-22T16:00:00'),
    pricePoints: 10000,
    couponDiscountPoints: 0,
    paidPoints: 10000,
    createdAt: new Date('2026-01-18T10:00:00'),
    updatedAt: new Date('2026-01-22T17:00:00'),
    completedAt: new Date('2026-01-22T17:00:00'),
    class: {
      title: '크로스핏 클래스',
      center: {
        name: '크로스핏 짐',
      },
    },
    slot: {
      startAt: new Date('2026-01-22T16:00:00'),
      endAt: new Date('2026-01-22T17:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
  {
    id: 'history-5',
    userId: 'user-1',
    classId: 'class-5',
    slotId: 'slot-class-5-20260126-0900',
    status: 'COMPLETED' as ReservationStatus,
    slotStartAt: new Date('2026-01-26T09:00:00'),
    pricePoints: 2000,
    couponDiscountPoints: 0,
    paidPoints: 2000,
    createdAt: new Date('2026-01-22T10:00:00'),
    updatedAt: new Date('2026-01-26T10:00:00'),
    completedAt: new Date('2026-01-26T10:00:00'),
    class: {
      title: '스트레칭 클래스',
      center: {
        name: '웰니스 센터',
      },
    },
    slot: {
      startAt: new Date('2026-01-26T09:00:00'),
      endAt: new Date('2026-01-26T10:00:00'),
      capacity: 10,
      _count: {
        reservations: 5,
      },
    },
  },
];
