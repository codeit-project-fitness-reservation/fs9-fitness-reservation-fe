import { cn } from '@/lib/utils';

// 예약·승인(파란) | 취소·반려(빨간) | 완료·대기(회색)
const CHIP_STYLE = {
  blue: 'bg-blue-50 text-blue-600',
  red: 'bg-white text-red-600 border border-red-200',
  gray: 'bg-gray-100 text-gray-700 border border-gray-200',
} as const;

export const STATUS_STYLES: Record<string, string> = {
  APPROVED: CHIP_STYLE.blue,
  BOOKED: CHIP_STYLE.blue,
  REJECTED: CHIP_STYLE.red,
  CANCELED: CHIP_STYLE.red,
  PENDING: CHIP_STYLE.gray,
  COMPLETED: CHIP_STYLE.gray,
};

export const STATUS_LABELS: Record<string, string> = {
  APPROVED: '승인',
  REJECTED: '반려',
  PENDING: '대기',
  BOOKED: '예약',
  CANCELED: '취소',
  COMPLETED: '완료',
};

interface StatusChipProps {
  status: string;
  className?: string;
  label?: string; // Optional override
}

export default function StatusChip({ status, className, label }: StatusChipProps) {
  const style = STATUS_STYLES[status] ?? CHIP_STYLE.gray;
  const displayLabel = label ?? STATUS_LABELS[status] ?? status;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium',
        style,
        className,
      )}
    >
      {displayLabel}
    </span>
  );
}
