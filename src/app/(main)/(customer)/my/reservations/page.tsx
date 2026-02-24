'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Reservation } from '@/types';
import { reservationApi } from '@/lib/api/reservation';

import mapPinIcon from '@/assets/images/map-pin.svg';
import clockIcon from '@/assets/images/clock.svg';
import chevronDownIcon from '@/assets/images/chevron-down.svg';
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

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleFocus = () => {
      setCurrentPage(1);
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const response = await reservationApi.getMyReservations({
          status: 'BOOKED',
          page: currentPage,
          limit: 10,
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('Reservations API response:', response);
          console.log('Response type:', typeof response);
          console.log('Response keys:', response ? Object.keys(response) : 'null');
        }

        const reservationsData = Array.isArray(response?.data) ? response.data : [];
        const total = response?.total ?? 0;

        const mappedReservations: Reservation[] = reservationsData.map((res) => ({
          id: res.id,
          userId: res.userId || '',
          classId: res.classId,
          slotId: res.slotId,
          status: res.status,
          slotStartAt: res.slotStartAt,
          pricePoints: res.pricePoints,
          couponDiscountPoints: res.couponDiscountPoints ?? 0,
          paidPoints: res.paidPoints ?? res.pricePoints,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          canceledAt: res.canceledAt ?? undefined,
          class: {
            title: res.class.title,
            center: {
              name: res.class.center.name,
            },
          },
          slot: res.slot
            ? {
                startAt: res.slot.startAt,
                endAt: res.slot.endAt,
                capacity: res.slot.capacity,
                _count: {
                  reservations: res.slot._count.reservations,
                },
              }
            : undefined,
        }));

        if (currentPage === 1) {
          setReservations(mappedReservations);
        } else {
          setReservations((prev) => [...prev, ...mappedReservations]);
        }

        const hasMoreData = total
          ? reservationsData.length < total
          : reservationsData.length === 10;
        setHasMore(hasMoreData);
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          error,
        });
        const errorMessage =
          error instanceof Error ? error.message : '예약 목록을 불러오는데 실패했습니다.';
        alert(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchReservations();
  }, [currentPage, refreshKey]);

  const handleViewDetails = (reservation: Reservation) => {
    if (reservation.slot) {
      const slotDate = new Date(reservation.slot.startAt);
      const dateStr = slotDate.toISOString().split('T')[0];
      const hour = String(slotDate.getHours()).padStart(2, '0');
      const dateKey = `${slotDate.getFullYear()}${String(slotDate.getMonth() + 1).padStart(2, '0')}${String(slotDate.getDate()).padStart(2, '0')}`;
      const actualSlotId = `slot-${reservation.classId}-${dateKey}-${hour}00`;
      router.push(
        `/classes/${reservation.classId}?slotId=${actualSlotId}&reservationDate=${dateStr}&reservationHour=${hour}&fromReservation=true`,
      );
    } else {
      router.push(`/classes/${reservation.classId}`);
    }
  };

  const handleCancelClick = (reservationId: string) => {
    setCancelReservationId(reservationId);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelReservationId) return;

    try {
      await reservationApi.cancelReservation(cancelReservationId);

      setReservations((prev) =>
        prev.map((res) =>
          res.id === cancelReservationId
            ? { ...res, status: 'CANCELED' as const, canceledAt: new Date().toISOString() }
            : res,
        ),
      );

      alert('예약이 취소되었습니다.');
      setIsCancelModalOpen(false);
      setCancelReservationId(null);
    } catch (error) {
      console.error('예약 취소 실패:', error);
      alert('예약 취소에 실패했습니다.');
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (isLoading && reservations.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <p className="text-base font-medium text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="내 예약" />

      <div className="mx-auto flex w-full flex-col gap-4 bg-gray-50 px-4 py-6 md:max-w-240">
        {reservations.length > 0 ? (
          <>
            <div className="flex flex-col gap-3">
              {reservations.map((reservation) => (
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

                  <p className="text-base font-bold text-gray-900">
                    {reservation.pricePoints.toLocaleString()}원
                  </p>

                  <div className="flex gap-2">
                    <BaseButton
                      variant="secondary"
                      className="flex-1 rounded-md border-gray-300"
                      onClick={() => handleViewDetails(reservation)}
                    >
                      상세보기
                    </BaseButton>
                    {reservation.status === 'BOOKED' && (
                      <BaseButton
                        variant="secondary"
                        className="flex-1 rounded-md border-gray-300"
                        onClick={() => handleCancelClick(reservation.id)}
                      >
                        취소
                      </BaseButton>
                    )}
                  </div>
                </div>
              ))}
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
                alt="빈 예약 내역"
                width={228}
                height={207}
              />
            </div>
            <p className="mb-1 text-base text-gray-900">예약 내역이 없어요.</p>
            <p className="mb-8 text-sm text-gray-500">마음에 드는 클래스를 예약해보세요.</p>
            <BaseButton variant="primary" onClick={() => router.push('/classes')}>
              클래스 보러가기
            </BaseButton>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setCancelReservationId(null);
        }}
        onConfirm={handleCancelConfirm}
        message="예약을 취소하시겠습니까?"
        confirmText="취소하기"
      />
    </div>
  );
}
