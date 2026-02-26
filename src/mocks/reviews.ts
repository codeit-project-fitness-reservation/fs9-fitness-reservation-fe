import { Review } from '@/types';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    reservationId: 'reservation-1',
    userId: 'user-2',
    classId: 'class-1',
    rating: 5,
    content: '정말 좋은 클래스였어요! 강사님이 친절하시고 운동 효과도 좋았습니다.',
    imgUrls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    ],
    createdAt: '2026-01-25T10:00:00.000Z',
    userNickname: '김철수',
    userProfileImg: undefined,
  },
  {
    id: 'review-2',
    reservationId: 'reservation-2',
    userId: 'user-3',
    classId: 'class-1',
    rating: 4,
    content: '운동 강도가 적당해서 초보자도 따라하기 좋았어요. 다음에도 또 신청할 예정입니다!',
    imgUrls: [],
    createdAt: '2026-01-24T15:30:00.000Z',
    userNickname: '이영희',
    userProfileImg: undefined,
  },
  {
    id: 'review-3',
    reservationId: 'reservation-3',
    userId: 'user-4',
    classId: 'class-1',
    rating: 5,
    content: '30분이지만 운동량이 많아서 만족스러웠습니다. 시설도 깔끔하고 좋아요.',
    imgUrls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
    ],
    createdAt: '2026-01-23T09:20:00.000Z',
    userNickname: '박민수',
    userProfileImg: undefined,
  },
  {
    id: 'review-4',
    reservationId: 'reservation-4',
    userId: 'user-5',
    classId: 'class-1',
    rating: 4,
    content: '시간대가 좋고 강사님이 설명을 잘 해주셔서 이해하기 쉬웠어요.',
    imgUrls: [],
    createdAt: '2026-01-22T14:00:00.000Z',
    userNickname: '최지영',
    userProfileImg: undefined,
  },
  {
    id: 'review-5',
    reservationId: 'reservation-5',
    userId: 'user-6',
    classId: 'class-1',
    rating: 5,
    content: '가격 대비 만족도가 높아요! 정기적으로 다니려고 합니다.',
    imgUrls: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    ],
    createdAt: '2026-01-21T11:15:00.000Z',
    userNickname: '정수진',
    userProfileImg: undefined,
  },
];

export function getMockReviewsForClass(classId: string): Review[] {
  return MOCK_REVIEWS.filter((review) => review.classId === classId);
}
