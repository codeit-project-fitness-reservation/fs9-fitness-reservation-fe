import { useState } from 'react';
import { Reservation } from '@/types';
import StatusChip from '@/components/StatusChip';
import ReservationDetailModal from './ReservationDetailModal';
import { reservationApi } from '@/lib/api/reservation';

interface ReservationListProps {
  reservations: Reservation[];
  loading: boolean;
  onRefresh: () => void;
}

export default function ReservationList({
  reservations,
  loading,
  onRefresh,
}: ReservationListProps) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const handleOpenModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    if (!confirm('정말 이 예약을 취소하시겠습니까?')) return;

    const cancelNote = prompt('취소 사유를 입력해주세요.', '관리자 직권 취소');
    if (cancelNote == null) return; // 취소 버튼 클릭 시 중단

    try {
      await reservationApi.cancelReservation(reservation.id, cancelNote);
      alert('예약이 취소되었습니다.');
      handleCloseModal();
      onRefresh();
    } catch (error) {
      console.error('예약 취소 실패:', error);
      alert('예약 취소에 실패했습니다.');
    }
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">예약 시간</th>
                <th className="px-6 py-3">예약 ID</th>
                <th className="px-6 py-3">센터</th>
                <th className="px-6 py-3">클래스</th>
                <th className="px-6 py-3">예약시간</th>
                <th className="px-6 py-3">결제 포인트</th>
                <th className="px-6 py-3">인원</th>
                <th className="px-6 py-3">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    로딩 중...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => {
                  const capacityStr =
                    reservation.slot?.capacity && reservation.slot?._count?.reservations != null
                      ? `${reservation.slot._count.reservations}/${reservation.slot.capacity}`
                      : '-';
                  const createdAtTime = reservation.createdAt
                    ? new Date(reservation.createdAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : '-';
                  const slotTimeStr = reservation.slotStartAt
                    ? (() => {
                        const d = new Date(reservation.slotStartAt);
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        const h = d.getHours();
                        return `${y}.${m}.${day} ${h}시`;
                      })()
                    : '-';
                  return (
                    <tr
                      key={reservation.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenModal(reservation)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenModal(reservation);
                        }
                      }}
                      className="cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none focus:ring-inset"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{createdAtTime}</td>
                      <td
                        className="max-w-[80px] truncate px-6 py-4 font-medium text-gray-900"
                        title={reservation.id}
                      >
                        {reservation.id}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {reservation.class?.center?.name ?? '-'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {reservation.class?.title || reservation.classId || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{slotTimeStr}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {(reservation.paidPoints ?? reservation.pricePoints ?? 0).toLocaleString()}P
                      </td>
                      <td className="px-6 py-4 text-gray-900">{capacityStr}</td>
                      <td className="px-6 py-4">
                        <StatusChip status={reservation.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReservationDetailModal
        reservation={selectedReservation}
        isOpen={!!selectedReservation}
        onClose={handleCloseModal}
        onCancelReservation={handleCancelReservation}
      />
    </>
  );
}
