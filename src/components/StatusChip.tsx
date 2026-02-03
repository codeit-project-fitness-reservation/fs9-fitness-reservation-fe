import React from 'react';
import { cn } from '@/lib/utils';

export const STATUS_STYLES: Record<string, string> = {
  // Common Positive
  APPROVED: 'bg-blue-500 text-white',
  BOOKED: 'bg-blue-500 text-white',

  // Common Negative
  REJECTED: 'bg-red-500 text-white',
  CANCELED: 'bg-red-500 text-white',

  // Common Neutral/Gray
  PENDING: 'bg-gray-500 text-white',
  COMPLETED: 'bg-gray-500 text-white',
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
  const style = STATUS_STYLES[status] ?? 'bg-gray-200 text-gray-800';
  const displayLabel = label ?? STATUS_LABELS[status] ?? status;

  return (
    <span
      className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', style, className)}
    >
      {displayLabel}
    </span>
  );
}
