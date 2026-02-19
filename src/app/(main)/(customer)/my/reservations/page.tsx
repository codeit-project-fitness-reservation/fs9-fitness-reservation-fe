'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Reservation } from '@/types';
import { MOCK_RESERVATIONS } from '@/mocks/reservations';

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
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

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
      setReservations((prev) =>
        prev.map((res) =>
          res.id === cancelReservationId
            ? { ...res, status: 'CANCELED' as const, canceledAt: new Date() }
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
    if (hasMore) {
      const moreReservations: Reservation[] = [
        {
          id: String(reservations.length + 1),
          userId: 'user-1',
          classId: `class-${reservations.length + 1}`,
          slotId: `slot-${reservations.length + 1}`,
          status: 'BOOKED',
          slotStartAt: new Date('2026-01-25T14:00:00'),
          pricePoints: 5000,
          createdAt: new Date(),
          updatedAt: new Date(),
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

      setReservations((prev) => [...prev, ...moreReservations]);

      if (reservations.length + moreReservations.length >= 10) {
        setHasMore(false);
      }
    }
  };

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
