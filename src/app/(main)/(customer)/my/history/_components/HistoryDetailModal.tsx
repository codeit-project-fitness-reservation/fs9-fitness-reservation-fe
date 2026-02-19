'use client';

import Modal from '@/components/Modal';
import { Reservation } from '@/types';
import StatusChip from '@/components/StatusChip';
import { format } from 'date-fns';
import Image from 'next/image';
import xIcon from '@/assets/images/x-close.svg';
import mapPinIcon from '@/assets/images/map-pin.svg';
import clockIcon from '@/assets/images/clock.svg';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

interface HistoryDetailModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryDetailModal({
  reservation,
  isOpen,
  onClose,
}: HistoryDetailModalProps) {
  if (!reservation) return null;

  const capacityStr =
    reservation.slot?.capacity && reservation.slot?._count?.reservations != null
      ? `${reservation.slot._count.reservations}/${reservation.slot.capacity}`
      : '-';

  const paid = reservation.paidPoints ?? reservation.pricePoints ?? 0;
  const couponDiscount = reservation.couponDiscountPoints ?? 0;

  // 날짜/시간 포맷팅
  const formatDateTime = (date: Date | string | undefined): string => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy.MM.dd. HH:mm');
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy.MM.dd');
  };

  const formatTime = (date: Date | string | undefined): string => {
    if (!date) return '-';
    return format(new Date(date), 'HH:mm');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[600px] max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">수강 내역 상세</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <Image src={getSvgSrc(xIcon)} alt="닫기" width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* 클래스 정보 */}
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-gray-900">클래스 정보</h3>
            <div className="space-y-3">
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {reservation.class?.title || '-'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Image
                  src={getSvgSrc(mapPinIcon)}
                  alt="위치"
                  width={16}
                  height={16}
                  className="shrink-0"
                />
                <span>{reservation.class?.center?.name || '-'}</span>
              </div>
              {reservation.slot && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Image
                    src={getSvgSrc(clockIcon)}
                    alt="시간"
                    width={16}
                    height={16}
                    className="shrink-0"
                  />
                  <span>
                    {formatDate(reservation.slot.startAt)} {formatTime(reservation.slot.startAt)} -{' '}
                    {formatTime(reservation.slot.endAt)}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* 수강 정보 */}
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-gray-900">수강 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">수강 상태</span>
                <StatusChip status={reservation.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">수강 완료일</span>
                <span className="text-gray-900">
                  {reservation.completedAt ? formatDateTime(reservation.completedAt) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">예약일</span>
                <span className="text-gray-900">
                  {reservation.createdAt ? formatDateTime(reservation.createdAt) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">인원</span>
                <span className="text-gray-900">{capacityStr}</span>
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
                <span className="text-gray-500">결제 금액</span>
                <span className="text-gray-900">
                  <span className="font-bold">{paid.toLocaleString()}원</span>
                  {couponDiscount > 0 && (
                    <span className="ml-1 font-normal text-gray-500">
                      (쿠폰 할인 -{couponDiscount.toLocaleString()}원)
                    </span>
                  )}
                </span>
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
              {reservation.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {formatDateTime(reservation.createdAt)} - 예약
                  </span>
                  <StatusChip status="BOOKED" />
                </div>
              )}
              {reservation.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {formatDateTime(reservation.completedAt)} - 수강 완료
                  </span>
                  <StatusChip status="COMPLETED" />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
