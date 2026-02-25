'use client';

import Image from 'next/image';
import Modal from './Modal';
import xClose from '@/assets/images/x-close.svg';
import ModalFooterButtons from '@/components/common/ModalFooterButtons';

interface ConfirmationModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText: string;
}

const ConfirmationModalContent = ({
  onClose,
  onConfirm,
  message,
  confirmText,
}: Omit<ConfirmationModalProps, 'isOpen'>) => {
  return (
    <div
      className="relative flex h-51 w-85.75 flex-col rounded-3xl bg-white p-6 shadow-xl md:h-59 md:w-105"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
      >
        <Image src={xClose} alt="닫기" width={18} height={18} />
      </button>

      <div className="h-12 w-full md:h-13" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-center text-center">
        <p className="text-base leading-relaxed font-medium whitespace-pre-wrap text-gray-900">
          {message}
        </p>
      </div>

      <ModalFooterButtons
        cancelLabel="취소"
        submitLabel={confirmText}
        onCancel={onClose}
        onSubmit={onConfirm}
        className="mt-8 gap-2 md:mt-10"
      />
    </div>
  );
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText,
}: ConfirmationModalProps) {
  const content = (
    <ConfirmationModalContent
      onClose={onClose}
      onConfirm={onConfirm}
      message={message}
      confirmText={confirmText}
    />
  );

  // isOpen이 제공되면 Modal로 래핑 (직접 렌더링 시)
  // isOpen이 없으면 내용만 반환 (ModalProvider를 통해 사용 시)
  if (isOpen !== undefined) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        {content}
      </Modal>
    );
  }

  return content;
}
