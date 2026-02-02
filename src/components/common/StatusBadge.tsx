import React from 'react';

export type StatusType = 'PENDING' | 'REJECTED' | 'APPROVED' | 'COMPLETED' | 'REFUNDED';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export default function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  //  상태별 스타일
  const getStyle = (s: StatusType) => {
    switch (s) {
      case 'PENDING':
        return 'bg-blue-50 text-blue-600';
      case 'REJECTED':
        return 'bg-error-50 text-error-600';
      case 'APPROVED':
        return 'bg-gray-100 text-gray-700';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-600';
      case 'REFUNDED':
        return 'bg-error-50 text-error-600';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] leading-none font-medium whitespace-nowrap ${getStyle(
        status,
      )} ${className}`}
    >
      {label || status}
    </span>
  );
}
