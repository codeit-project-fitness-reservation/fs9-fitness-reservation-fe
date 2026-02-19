'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import SearchBar from '@/app/(main)/(customer)/classes/_components/SearchBar';
import WriteReviewModal from './_components/WriteReviewModal';
import SortModal, { HistorySortOption } from './_components/SortModal';
import HistoryDetailModal from './_components/HistoryDetailModal';
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

// Mock 수강 내역 데이터 (완료된 예약) - 정렬 테스트를 위해 다양한 날짜와 가격으로 구성
const MOCK_HISTORY: Reservation[] = [
  {
    id: '1',
    userId: 'user-1',
    classId: 'class-1',
    slotId: 'slot-1',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-20T10:00:00'),
    pricePoints: 3000,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-20'),
    completedAt: new Date('2026-01-20T11:00:00'), // 오래된 날짜
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
    id: '2',
    userId: 'user-1',
    classId: 'class-2',
    slotId: 'slot-2',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-24T12:00:00'),
    pricePoints: 5000,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-24'),
    completedAt: new Date('2026-01-24T13:00:00'), // 중간 날짜
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
    id: '3',
    userId: 'user-1',
    classId: 'class-3',
    slotId: 'slot-3',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-28T14:00:00'),
    pricePoints: 8000,
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-01-28'),
    completedAt: new Date('2026-01-28T15:00:00'), // 최신 날짜
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
    id: '4',
    userId: 'user-1',
    classId: 'class-4',
    slotId: 'slot-4',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-22T16:00:00'),
    pricePoints: 10000,
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-22'),
    completedAt: new Date('2026-01-22T17:00:00'), // 중간 날짜, 높은 가격
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
    id: '5',
    userId: 'user-1',
    classId: 'class-5',
    slotId: 'slot-5',
    status: 'COMPLETED',
    slotStartAt: new Date('2026-01-26T09:00:00'),
    pricePoints: 2000,
    createdAt: new Date('2026-01-22'),
    updatedAt: new Date('2026-01-26'),
    completedAt: new Date('2026-01-26T10:00:00'), // 최신 날짜, 낮은 가격
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

export default function HistoryPage() {
  const router = useRouter();
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  // TODO: 실제 수강 내역 데이터로 교체
  const [history, setHistory] = useState<Reservation[]>(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<HistorySortOption>('latest');

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  const handleWriteReview = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (data: { rating: number; content: string; images: File[] }) => {
    if (!selectedReservation) return;

    setIsSubmittingReview(true);
    try {
      // TODO: 실제 API 호출로 교체
      // FormData 생성
      const formData = new FormData();
      formData.append('reservationId', selectedReservation.id);
      formData.append('rating', data.rating.toString());
      formData.append('content', data.content);

      // 이미지 파일 추가
      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      // API 호출 예시
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   body: formData,
      // });
      // if (!response.ok) throw new Error('리뷰 등록에 실패했습니다.');

      // 임시: 성공 처리
      console.log('Review submitted:', {
        reservationId: selectedReservation.id,
        rating: data.rating,
        content: data.content,
        imageCount: data.images.length,
      });

      alert('리뷰가 등록되었습니다.');
      setIsReviewModalOpen(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Review submission error:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmittingReview(false);
    }
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

  // 정렬 모달 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortOpen]);

  const handleFilterClick = () => {
    setIsSortOpen(false);
    // TODO: 필터 모달 열기
    console.log('Filter click');
  };

  const handleSortClick = () => {
    setIsSortOpen((prev) => !prev);
  };

  const handleSortSelect = (sort: HistorySortOption) => {
    setSelectedSort(sort);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 검색어로 필터링
  let filteredHistory = searchQuery
    ? history.filter((item) => item.class?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : history;

  // 정렬 적용
  filteredHistory = [...filteredHistory].sort((a, b) => {
    switch (selectedSort) {
      case 'latest':
        // 최신순 (completedAt 기준 내림차순)
        const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bDate - aDate;
      case 'oldest':
        // 오래된순 (completedAt 기준 오름차순)
        const aDateOld = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bDateOld = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return aDateOld - bDateOld;
      case 'priceHigh':
        // 가격 높은순
        return b.pricePoints - a.pricePoints;
      case 'priceLow':
        // 가격 낮은순
        return a.pricePoints - b.pricePoints;
      default:
        return 0;
    }
  });

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="수강 내역" />

      <div className="mx-auto flex w-full flex-col gap-4 bg-gray-50 px-4 py-6 md:max-w-240">
        {/* 검색 및 필터 바 */}
        <div className="flex items-start gap-2">
          {/* 왼쪽: 필터 버튼 (정렬 모달 포함) */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={handleSortClick}
              className="flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50"
              aria-label="정렬"
            >
              <Image
                src={getSvgSrc(filterLinesIcon as SvgImport)}
                alt="정렬"
                width={20}
                height={20}
              />
            </button>
            <SortModal
              isOpen={isSortOpen}
              selectedSort={selectedSort}
              onClose={() => setIsSortOpen(false)}
              onSelect={handleSortSelect}
            />
          </div>
          {/* 오른쪽: 검색바 */}
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

      {/* 리뷰 작성 모달 */}
      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReservation(null);
        }}
        onSubmit={handleReviewSubmit}
        isLoading={isSubmittingReview}
      />

      {/* 수강 내역 상세 모달 */}
      <HistoryDetailModal
        reservation={selectedReservation}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReservation(null);
        }}
      />
    </div>
  );
}
