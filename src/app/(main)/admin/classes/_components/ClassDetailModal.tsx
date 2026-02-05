import { useState } from 'react';
import Modal from '@/components/Modal';
import { ClassItem, classApi } from '@/lib/api/class';
import StatusChip from '@/components/StatusChip';
import { format } from 'date-fns';
import { ClassStatus } from '@/types/class';
import InputModal from '@/components/InputModal';
import Image from 'next/image';
import xIcon from '@/assets/images/x-close.svg';

interface ClassDetailModalProps {
  classItem: ClassItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export default function ClassDetailModal({
  classItem,
  isOpen,
  onClose,
  onStatusChange,
}: ClassDetailModalProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!classItem) return null;

  const capacityStr = `${classItem._count.reservations}/${classItem.capacity}`;

  const handleApprove = async () => {
    if (!confirm('이 클래스를 승인하시겠습니까?')) return;
    try {
      await classApi.approveClass(classItem.id);
      alert('클래스가 승인되었습니다.');
      onStatusChange?.();
      onClose();
    } catch (error) {
      console.error('승인 실패:', error);
      alert('승인 처리에 실패했습니다.');
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    try {
      await classApi.rejectClass(classItem.id, reason);
      alert('클래스가 반려되었습니다.');
      setShowRejectModal(false);
      onStatusChange?.();
      onClose();
    } catch (error) {
      console.error('반려 실패:', error);
      alert('반려 처리에 실패했습니다.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-[600px] max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">클래스 상세</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="닫기"
            >
              <Image src={xIcon} alt="닫기" width={20} height={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* 기본 정보 */}
            <section className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-gray-900">기본 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">클래스명</span>
                  <span className="font-medium text-gray-900">{classItem.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">클래스 ID</span>
                  <span className="text-gray-900">{classItem.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">센터</span>
                  <span className="text-gray-900">{classItem.center.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">등록일</span>
                  <span className="text-gray-900">
                    {format(new Date(classItem.createdAt), 'yyyy.MM.dd HH:mm')}
                  </span>
                </div>
              </div>
            </section>

            {/* 운영 정보 */}
            <section className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-gray-900">운영 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">가격</span>
                  <span className="font-medium text-gray-900">
                    {classItem.pricePoints.toLocaleString()}P
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">정원 (예약/총원)</span>
                  <span className="text-gray-900">{capacityStr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">상태</span>
                  <StatusChip status={classItem.status} />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              닫기
            </button>
            {classItem.status === ClassStatus.PENDING && (
              <>
                <button
                  type="button"
                  onClick={handleRejectClick}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  반려
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  승인
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* 반려 사유 입력 모달 */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <InputModal
          title="반려 사유"
          label="내용"
          placeholder="반려 사유를 입력해 주세요."
          submitButtonText="전송"
          onClose={() => setShowRejectModal(false)}
          onSubmit={handleRejectSubmit}
        />
      </Modal>
    </>
  );
}
