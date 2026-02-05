import Image from 'next/image';
import xCloseIcon from '@/assets/images/x-close.svg';

type FilterBadgeProps = {
  label: string;
  onRemove: () => void;
};

export default function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-blue-500 bg-blue-50 px-3 py-1.5">
      <p className="text-sm font-medium text-blue-500">{label}</p>
      <button
        onClick={onRemove}
        className="flex size-3.5 items-center justify-center transition-opacity hover:opacity-70"
        aria-label={`${label} 필터 제거`}
      >
        <Image src={xCloseIcon} alt="제거" width={14} height={14} />
      </button>
    </div>
  );
}
