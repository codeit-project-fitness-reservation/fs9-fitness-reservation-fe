'use client';

import { ReactNode, MouseEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  zIndex?: number;
}

export default function Modal({ isOpen, onClose, children, zIndex = 1000 }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-backdrop absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
