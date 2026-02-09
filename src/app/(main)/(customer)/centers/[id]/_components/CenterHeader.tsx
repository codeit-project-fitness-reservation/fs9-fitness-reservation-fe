'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import icChevronLeft from '@/assets/images/chevron-left.svg';
import starIcon from '@/assets/images/Star.svg';
import starBackgroundIcon from '@/assets/images/Star background.svg';

interface CenterHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function CenterHeader({
  title,
  onBack,
  showBackButton = true,
  isFavorite = false,
  onFavoriteToggle,
}: CenterHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-14 z-40 h-14 w-full bg-gray-200">
      <div className="mx-auto flex h-full w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:max-w-240">
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

        <button
          onClick={onFavoriteToggle}
          className="relative flex size-6 items-center justify-center"
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          {isFavorite ? (
            <Image src={starIcon} alt="즐겨찾기" width={24} height={24} />
          ) : (
            <Image src={starBackgroundIcon} alt="즐겨찾기" width={24} height={24} />
          )}
        </button>
      </div>
    </header>
  );
}
