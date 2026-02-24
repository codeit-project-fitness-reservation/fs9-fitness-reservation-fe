'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import { ReservationItem, classApi } from '@/lib/api/class';
import StatusChip from '@/components/StatusChip';
import { format } from 'date-fns';
import icXClose from '@/assets/images/x-close.svg';

interface ReservationDetailModalProps {
  onClose: () => void;
  reservationId: string;
}

const Section = ({
  title,
  children,
  isGray = false,
}: {
  title: string;
  children: ReactNode;
  isGray?: boolean;
}) => (
  <section className="w-full">
    <h3 className="mb-3 text-base font-semibold text-gray-900">{title}</h3>
    <div
      className={`space-y-3 rounded-xl p-4 md:p-6 ${isGray ? 'bg-gray-50' : 'border border-gray-200 bg-white'}`}
    >
      {children}
    </div>
  </section>
);

const InfoRow = ({
  label,
  children,
  labelWidth = 'w-20',
}: {
  label: string;
  children: ReactNode;
  labelWidth?: string;
}) => (
  <div className="flex items-center justify-start gap-4 text-sm">
    <span className={`${labelWidth} shrink-0 text-gray-500`}>{label}</span>
    <div className="font-semibold text-gray-900">{children}</div>
  </div>
);

export default function ReservationDetailModal({
  onClose,
  reservationId,
}: ReservationDetailModalProps) {
  const [data, setData] = useState<ReservationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      const reservationData = await classApi.getSellerReservationDetail(reservationId);
      setData(reservationData);
    } catch (error) {
      console.error('상세 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleCancelReservation = async () => {
    if (!data) return;
    if (data.status === 'CANCELED' || data.status === 'COMPLETED') {
      alert('이미 취소되었거나 완료된 예약은 취소할 수 없습니다.');
      return;
    }
    if (!window.confirm('정말로 이 예약을 취소하시겠습니까?')) return;

    setIsCanceling(true);
    try {
      await classApi.cancelReservationBySeller(data.id);
      alert('예약이 정상적으로 취소되었습니다.');
      await fetchDetail();
    } catch (error) {
      console.error('예약 취소 실패:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    } finally {
      setIsCanceling(false);
    }
  };

  if (loading) return <div className="p-10 text-center">정보를 불러오는 중...</div>;
  if (!data) return null;

  // 비활성화 조건 정의
  const isCancelDisabled = isCanceling || data.status === 'CANCELED' || data.status === 'COMPLETED';

  const timelineItems: { at: Date; status: string }[] = [];
  if (data.createdAt) {
    timelineItems.push({ at: new Date(data.createdAt), status: 'BOOKED' });
  }
  if (data.completedAt) {
    timelineItems.push({ at: new Date(data.completedAt), status: 'COMPLETED' });
  }
  if (data.canceledAt) {
    timelineItems.push({ at: new Date(data.canceledAt), status: 'CANCELED' });
  }
  timelineItems.sort((a, b) => a.at.getTime() - b.at.getTime());

  const pricePoints = data.pricePoints ?? 0;
  const couponDiscount = data.couponDiscountPoints ?? 0;
  const paidPoints = data.paidPoints ?? Math.max(0, pricePoints - couponDiscount);
  const displayStatus = data.status;

  const useEntry = data.pointHistories?.find((ph) => ph.type === 'USE');
  const paymentId = useEntry?.paymentKey ?? data.payment?.paymentId ?? data.id ?? '-';
  const orderNumber = useEntry?.orderId ?? data.payment?.orderNumber ?? '-';

  return (
    <div
      className="s relative flex max-h-[90vh] w-85.75 flex-col overflow-hidden bg-white p-6 shadow-xl md:w-100 md:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 md:text-xl">예약 정보</h2>
        <button onClick={onClose} className="transition-opacity hover:opacity-70">
          <Image src={icXClose} alt="닫기" width={24} height={24} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <Section title="기본 정보">
          <InfoRow label="닉네임">{data.user?.nickname || data.user?.name || '-'}</InfoRow>
          <InfoRow label="상태">
            <StatusChip status={displayStatus} />
          </InfoRow>
        </Section>

        <Section title="결제 정보" isGray>
          <InfoRow label="결제수단">포인트</InfoRow>
          <InfoRow label="금액">
            {paidPoints.toLocaleString()}P
            {couponDiscount > 0 && (
              <span className="ml-1 text-xs font-normal text-gray-400 md:text-sm">
                (쿠폰 -{couponDiscount.toLocaleString()}P)
              </span>
            )}
          </InfoRow>
          <InfoRow label="결제 ID">{paymentId}</InfoRow>
          <InfoRow label="주문번호">{orderNumber}</InfoRow>
        </Section>

        <Section title="타임라인" isGray>
          {timelineItems.length > 0 ? (
            timelineItems.map((item, i) => (
              <InfoRow key={i} label={format(item.at, 'yyyy.MM.dd. HH:mm')} labelWidth="w-32">
                <StatusChip status={item.status} />
              </InfoRow>
            ))
          ) : (
            <p className="text-sm text-gray-500">타임라인 이벤트가 없습니다.</p>
          )}
        </Section>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors md:py-3.5 ${
            isCancelDisabled
              ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
              : 'border-gray-200 bg-white text-red-500 hover:bg-red-50'
          }`}
          onClick={handleCancelReservation}
          disabled={isCancelDisabled}
        >
          {isCanceling ? '처리 중...' : '예약 취소'}
        </button>
        <button className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 md:py-3.5">
          유저 메모
        </button>
      </div>
    </div>
  );
}
