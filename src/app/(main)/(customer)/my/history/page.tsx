'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import SearchBar from '@/app/(main)/(customer)/classes/_components/SearchBar';
import { Reservation } from '@/types';

import mapPinIcon from '@/assets/images/map-pin.svg';
import clockIcon from '@/assets/images/clock.svg';
import chevronDownIcon from '@/assets/images/chevron-down.svg';
import filterLinesIcon from '@/assets/images/filter-lines.svg';
import emptyStateIcon from '@/assets/images/Empty State.svg';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

// 날짜/시간 포맷팅 함수
const formatDateTime = (startAt: Date | string, endAt: Date | string): string => {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const day = String(start.getDate()).padStart(2, '0');
  const startHour = String(start.getHours()).padStart(2, '0');
  const startMin = String(start.getMinutes()).padStart(2, '0');
  const endHour = String(end.getHours()).padStart(2, '0');
  const endMin = String(end.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day}. ${startHour}:${startMin}-${endHour}:${endMin}`;
};

// Mock 수강 내역 데이터 (완료된 예약)
const MOCK_HISTORY: Reservation[] = [
  {
    id: '1',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-1',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-24T12:00:00'),
    pricePoints: 5000,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-24'),
    completedAt: new Date('2026-01-24T13:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
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
    id: '2',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-2',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-24T12:00:00'),
    pricePoints: 5000,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-24'),
    completedAt: new Date('2026-01-24T13:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
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
    id: '3',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-3',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-24T12:00:00'),
    pricePoints: 5000,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-24'),
    completedAt: new Date('2026-01-24T13:00:00'),
    class: {
      title: '30분 순환 근력 운동',
      center: {
        name: '에이원 필라테스',
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
];

export default function HistoryPage() {
  const router = useRouter();
  // TODO: 실제 수강 내역 데이터로 교체
  const [history, setHistory] = useState<Reservation[]>(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const handleViewDetails = (reservation: Reservation) => {
    // TODO: 상세보기 기능 구현
    router.push(`/classes/${reservation.classId}`);
  };

  const handleWriteReview = (reservation: Reservation) => {
    // TODO: 리뷰 작성 페이지로 이동
    console.log('Write review for:', reservation.id);
    // router.push(`/classes/${reservation.classId}/review?reservationId=${reservation.id}`);
  };

  const handleLoadMore = () => {
    // TODO: 실제 API 호출로 교체
    if (hasMore) {
      const moreHistory: Reservation[] = [
        {
          id: String(history.length + 1),
          userId: 'user-1',
          classId: `class-${history.length + 1}`,
          slotId: `slot-${history.length + 1}`,
          status: 'COMPLETED',
          slotStartAt: new Date('2026-01-25T14:00:00'),
          pricePoints: 5000,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: new Date('2026-01-25T15:00:00'),
          class: {
            title: '30분 순환 근력 운동',
            center: {
              name: '에이원 필라테스',
            },
          },
          slot: {
            startAt: new Date('2026-01-25T14:00:00'),
            endAt: new Date('2026-01-25T15:00:00'),
            capacity: 10,
            _count: {
              reservations: 3,
            },
          },
        },
      ];

      setHistory((prev) => [...prev, ...moreHistory]);

      // Mock: 10개 이상이면 더보기 비활성화
      if (history.length + moreHistory.length >= 10) {
        setHasMore(false);
      }
    }
  };

  const handleFilterClick = () => {
    // TODO: 필터 모달 열기
    console.log('Filter click');
  };

  const handleSearch = (query: string) => {
    // TODO: 검색 로직 구현
    console.log('Search:', query);
  };

  // 검색어로 필터링
  const filteredHistory = searchQuery
    ? history.filter((item) => item.class?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : history;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="수강 내역" />

      <div className="mx-auto flex w-full flex-col gap-4 bg-gray-50 px-4 py-6 md:max-w-240">
        {/* 검색 및 필터 바 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFilterClick}
            className="flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50"
            aria-label="필터"
          >
            <Image
              src={getSvgSrc(filterLinesIcon as SvgImport)}
              alt="필터"
              width={20}
              height={20}
            />
          </button>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="검색어를 입력해주세요."
            className="flex-1"
          />
        </div>

        {/* 수강 내역 리스트 또는 빈 상태 */}
        {filteredHistory.length > 0 ? (
          <>
            <div className="flex flex-col gap-3">
              {filteredHistory.map((reservation) => {
                const canWriteReview =
                  reservation.status === 'COMPLETED' && reservation.completedAt;

                return (
                  <div
                    key={reservation.id}
                    className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm"
                    style={{
                      boxShadow: '0 1px 8px 0 rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    {/* 제목 */}
                    <h3 className="text-base font-bold text-gray-900">
                      {reservation.class?.title || '클래스'}
                    </h3>

                    {/* 위치 */}
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={getSvgSrc(mapPinIcon as SvgImport)}
                        alt="위치"
                        width={16}
                        height={16}
                        className="shrink-0"
                      />
                      <p className="text-sm text-gray-500">경기 성남시 분당구 123-869 1층</p>
                    </div>

                    {/* 날짜/시간 */}
                    {reservation.slot && (
                      <div className="flex items-center gap-1.5">
                        <Image
                          src={getSvgSrc(clockIcon as SvgImport)}
                          alt="시간"
                          width={16}
                          height={16}
                          className="shrink-0"
                        />
                        <p className="text-sm text-gray-500">
                          {formatDateTime(reservation.slot.startAt, reservation.slot.endAt)}
                        </p>
                      </div>
                    )}

                    {/* 가격 */}
                    <p className="text-base font-bold text-gray-900">
                      {reservation.pricePoints.toLocaleString()}원
                    </p>

                    {/* 버튼 */}
                    <div className="flex gap-2">
                      <BaseButton
                        variant="secondary"
                        className="flex-1 rounded-md border-gray-300"
                        onClick={() => handleViewDetails(reservation)}
                      >
                        상세보기
                      </BaseButton>
                      {canWriteReview && (
                        <BaseButton
                          variant="primary"
                          className="flex-1 rounded-md"
                          onClick={() => handleWriteReview(reservation)}
                        >
                          리뷰 작성하기
                        </BaseButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 더보기 버튼 */}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="flex items-center justify-center gap-1 py-4 text-sm font-medium text-blue-600"
              >
                더보기
                <Image
                  src={getSvgSrc(chevronDownIcon as SvgImport)}
                  alt="더보기"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6">
              <Image
                src={getSvgSrc(emptyStateIcon as SvgImport)}
                alt="빈 수강 내역"
                width={228}
                height={207}
              />
            </div>
            <p className="mb-1 text-base text-gray-900">수강 내역이 없어요.</p>
            <p className="mb-8 text-sm text-gray-500">완료된 수강 내역이 여기에 표시됩니다.</p>
            <BaseButton variant="primary" onClick={() => router.push('/classes')}>
              클래스 보러가기
            </BaseButton>
          </div>
        )}
      </div>
    </div>
  );
}
