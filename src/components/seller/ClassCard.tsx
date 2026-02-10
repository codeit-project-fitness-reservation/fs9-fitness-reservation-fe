'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ClassItem } from '@/types';
import icUser from '@/assets/images/user-02.svg';
import StatusBadge from '@/components/common/StatusBadge';

export default function ClassCard({
  id,
  title,
  bannerUrl,
  imgUrls,
  displayCapacity,
  status,
  statusLabel,
}: ClassItem) {
  const router = useRouter();

  const statusUpper = status.toUpperCase();
  const isInactive = statusUpper === 'PENDING' || statusUpper === 'REJECTED';
  const isApproved = statusUpper === 'APPROVED';

  const imageUrl = bannerUrl || imgUrls?.[0];

  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (isApproved) {
      router.push(`/seller/${id}`);
    }
  };

  const getStatusLabel = () => {
    if (statusLabel) return statusLabel;

    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'PENDING':
        return '대기중';
      case 'REJECTED':
        return '반려됨';
      case 'APPROVED':
        return '승인';
      default:
        return status;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left ${
        isInactive ? 'bg-gray-100' : 'bg-white'
      } ${
        isApproved
          ? 'cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm'
          : 'cursor-default'
      }`}
    >
      <div
        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-200/40 ${
          isInactive ? 'bg-gray-200 opacity-40' : 'bg-blue-100'
        }`}
      >
        {imageUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            onError={() => {
              console.error('이미지 로드 실패:', imageUrl);
              setImageError(true);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <h3
            className={`truncate text-base font-semibold ${
              isInactive ? 'text-gray-500' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>

          {statusUpper !== 'APPROVED' && <StatusBadge status={status} label={getStatusLabel()} />}
        </div>

        {statusUpper === 'APPROVED' && displayCapacity && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Image src={icUser} alt="인원" width={14} height={14} />
            <span className="tabular-nums">{displayCapacity}</span>
          </div>
        )}
      </div>
    </div>
  );
}
