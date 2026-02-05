import Image from 'next/image';
import currentIcon from '@/assets/images/current.svg';

type CurrentLocationButtonProps = {
  onClick: () => void;
};

export default function CurrentLocationButton({ onClick }: CurrentLocationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 bottom-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50"
      aria-label="현재 위치로 이동"
    >
      <Image src={currentIcon} alt="현재 위치" width={24} height={24} />
    </button>
  );
}
