'use client';

import Image from 'next/image';
import xClose from '@/assets/images/x-close.svg';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText: string;
}

export default function ConfirmationModal({
  onClose,
  onConfirm,
  message,
  confirmText,
}: ConfirmationModalProps) {
  return (
    <div
      className="relative w-85.75 rounded-4xl bg-white shadow-xl md:w-115"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">확인</h2>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
        >
          <Image src={xClose} alt="닫기" width={24} height={24} />
        </button>
      </div>

      {/* 본문 */}
      <div className="px-6 pb-6">
        {/* 메시지 */}
        <div className="mb-8 text-center">
          <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap text-gray-800">
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#3182F6] py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
