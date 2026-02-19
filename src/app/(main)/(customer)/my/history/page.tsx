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
import { MOCK_HISTORY } from '@/mocks/reservations';

import mapPinIcon from '@/assets/images/map-pin.svg';
import clockIcon from '@/assets/images/clock.svg';
import chevronDownIcon from '@/assets/images/chevron-down.svg';
import filterLinesIcon from '@/assets/images/filter-lines.svg';
import emptyStateIcon from '@/assets/images/Empty State.svg';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

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

export default function HistoryPage() {
  const router = useRouter();
  const sortDropdownRef = useRef<HTMLDivElement>(null);
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
      const formData = new FormData();
      formData.append('reservationId', selectedReservation.id);
      formData.append('rating', data.rating.toString());
      formData.append('content', data.content);

      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

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

      if (history.length + moreHistory.length >= 10) {
        setHasMore(false);
      }
    }
  };

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

  let filteredHistory = searchQuery
    ? history.filter((item) => item.class?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : history;
  filteredHistory = [...filteredHistory].sort((a, b) => {
    switch (selectedSort) {
      case 'latest':
        const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bDate - aDate;
      case 'oldest':
        const aDateOld = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bDateOld = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return aDateOld - bDateOld;
      case 'priceHigh':
        return b.pricePoints - a.pricePoints;
      case 'priceLow':
        return a.pricePoints - b.pricePoints;
      default:
        return 0;
    }
  });

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="수강 내역" />

      <div className="mx-auto flex w-full flex-col gap-4 bg-gray-50 px-4 py-6 md:max-w-240">
        <div className="flex items-start gap-2">
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
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="검색어를 입력해주세요."
            className="flex-1"
          />
        </div>

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
                    <h3 className="text-base font-bold text-gray-900">
                      {reservation.class?.title || '클래스'}
                    </h3>

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

      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReservation(null);
        }}
        onSubmit={handleReviewSubmit}
        isLoading={isSubmittingReview}
      />

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
