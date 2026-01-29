'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import icChevronLeft from '@/assets/images/chevron-left.svg';

interface SimpleHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}
export default function SimpleHeader({ title, onBack, showBackButton = true }: SimpleHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white px-4">
      {showBackButton ? (
        <button
          onClick={handleBack}
          className="flex size-6 items-center justify-center"
          aria-label="뒤로 가기"
        >
          <Image src={icChevronLeft} alt="" width={24} height={24} className="text-gray-900" />
        </button>
      ) : (
        <div className="size-6" />
      )}

      <h1 className="text-base font-semibold text-gray-900">{title}</h1>

      <div className="size-6 opacity-0" />
    </header>
  );
}
