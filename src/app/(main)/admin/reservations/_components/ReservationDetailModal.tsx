import React from 'react';
import Modal from '@/components/Modal';
import { Reservation } from '@/types';
import StatusChip from '@/components/StatusChip';
import { format } from 'date-fns';

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelReservation?: (reservation: Reservation) => void;
  onUserMemo?: (reservation: Reservation) => void;
}

export default function ReservationDetailModal({
  reservation,
  isOpen,
  onClose,
  onCancelReservation,
  onUserMemo,
}: ReservationDetailModalProps) {
  if (!reservation) return null;

  const capacityStr =
    reservation.slot?.capacity && reservation.slot?._count?.reservations != null
      ? `${reservation.slot._count.reservations}/${reservation.slot.capacity}`
      : '-';

  const paid = reservation.paidPoints ?? reservation.pricePoints ?? 0;
  const couponDiscount = reservation.couponDiscountPoints ?? 0;

  const timelineItems: { at: Date; label: string; status: string }[] = [];
  if (reservation.createdAt) {
    timelineItems.push({
      at: new Date(reservation.createdAt),
      label: '예약',
      status: 'BOOKED',
    });
  }
  if (reservation.canceledAt) {
    timelineItems.push({
      at: new Date(reservation.canceledAt),
      label: '취소',
      status: 'CANCELED',
    });
  }
  if (reservation.completedAt) {
    timelineItems.push({
      at: new Date(reservation.completedAt),
      label: '완료',
      status: 'COMPLETED',
    });
  }
  timelineItems.sort((a, b) => a.at.getTime() - b.at.getTime());

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[600px] max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">예약 상세</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* 기본 정보 */}
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-gray-900">기본 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">닉네임</span>
                <span className="font-medium text-gray-900">
                  {reservation.user?.nickname || reservation.userId || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">유저 ID</span>
                <span className="text-gray-900">{reservation.userId || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">센터</span>
                <span className="text-gray-900">{reservation.class?.center?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">인원</span>
                <span className="text-gray-900">{capacityStr}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">상태</span>
                <StatusChip status={reservation.status} />
              </div>
            </div>
          </section>

          {/* 결제 정보 */}
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-gray-900">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">결제수단</span>
                <span className="text-gray-900">포인트</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-gray-500">금액</span>
                <span className="text-gray-900">
                  <span className="font-bold">{paid.toLocaleString()}P</span>
                  {couponDiscount > 0 && (
                    <span className="ml-1 font-normal">
                      (쿠폰 -{couponDiscount.toLocaleString()}P)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">결제 ID</span>
                <span className="text-gray-900">{reservation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">주문번호</span>
                <span className="text-gray-900">{reservation.id || '-'}</span>
              </div>
            </div>
          </section>

          {/* 타임라인 */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-900">타임라인</h3>
            <div className="space-y-2 text-sm">
              {timelineItems.length === 0 ? (
                <p className="text-gray-500">타임라인 이벤트가 없습니다.</p>
              ) : (
                timelineItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-700">{format(item.at, 'yyyy.MM.dd. HH:mm')}</span>
                    <StatusChip status={item.status} />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Footer - Figma: 예약 취소(아웃라인) + 유저 메모(primary) */}
        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={() => onCancelReservation?.(reservation)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50"
          >
            예약 취소
          </button>
          <button
            type="button"
            onClick={() => onUserMemo?.(reservation)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            유저 메모
          </button>
        </div>
      </div>
    </Modal>
  );
}
