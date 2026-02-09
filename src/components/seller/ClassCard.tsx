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

  // 이미지 URL 유효성 검사 및 정규화
  const normalizeImageUrl = (url: string | undefined): string | null => {
    if (!url) return null;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // 이미 절대 경로인 경우
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      // localhost:4000을 localhost:3000으로 변경
      if (url.includes('localhost:4000')) {
        return url.replace('localhost:4000', 'localhost:3000');
      }
      return url;
    }

    // 상대 경로인 경우 API 베이스 URL 추가
    return url.startsWith('/') ? `${apiBase}${url}` : `${apiBase}/${url}`;
  };

  const isValidImageUrl = (url: string) => {
    return (
      url && (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://'))
    );
  };

  // 대소문자 모두 처리
  const statusUpper = status.toUpperCase();
  const isInactive = statusUpper === 'PENDING' || statusUpper === 'REJECTED';
  const isApproved = statusUpper === 'APPROVED';

  // 이미지 URL 정규화 및 선택
  const rawImageUrl = bannerUrl || imgUrls?.[0];
  const imageUrl = normalizeImageUrl(rawImageUrl);

  // 이미지 로드 실패 상태 관리
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (isApproved) {
      router.push(`/seller/${id}`);
    }
  };

  // 상태 라벨 결정 (statusLabel이 없으면 status에 따라 한글로 변환)
  const getStatusLabel = () => {
    if (statusLabel) return statusLabel;
    // 대소문자 모두 처리
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
        {imageUrl && isValidImageUrl(imageUrl) && !imageError ? (
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
