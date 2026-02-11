'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import dotsVertical from '@/assets/images/dots-vertical.svg';
interface KebabMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function KebabMenu({ onEdit, onDelete }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100"
        aria-label="메뉴"
      >
        <Image src={dotsVertical} alt="케밥 메뉴" width={24} height={24} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-32 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            수정하기
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full border-t border-gray-200 px-4 py-2 text-left text-sm font-medium hover:bg-gray-50"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}
