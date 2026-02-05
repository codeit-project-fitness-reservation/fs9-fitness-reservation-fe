'use client';

import Image from 'next/image';
import xClose from '@/assets/images/x-close.svg';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[320px] rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center text-gray-400 transition-opacity hover:opacity-70"
        >
          <Image src={xClose} alt="닫기" width={20} height={20} />
        </button>

        {/* 본문 메시지 */}
        <div className="mt-4 mb-8 text-center">
          <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap text-gray-800">
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
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
