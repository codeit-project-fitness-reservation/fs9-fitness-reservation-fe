'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/format';
import { API_BASE } from '@/lib/api';
import EmptyStateIcon from '@/assets/images/Empty State.svg';

interface ClassSales {
  id: string;
  title: string;
  revenue: number;
  imgUrl?: string;
}

interface ClassSalesSectionProps {
  classSales: ClassSales[];
}

function ClassSalesItem({ item }: { item: ClassSales }) {
  const [imageError, setImageError] = useState(false);

  // 이미지 URL 처리: 상대 경로면 API_BASE를 붙임
  const getImageUrl = (url?: string): string | undefined => {
    if (!url || url.trim() === '') return undefined;
    // 이미 전체 URL이면 그대로 사용
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // 상대 경로면 API_BASE를 붙임
    if (url.startsWith('/')) {
      return `${API_BASE}${url}`;
    }
    return url;
  };

  const imageUrl = getImageUrl(item.imgUrl);
  const hasValidImage = imageUrl && !imageError;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
      {hasValidImage ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={() => {
              if (process.env.NODE_ENV === 'development') {
                console.error('이미지 로드 실패:', imageUrl);
              }
              setImageError(true);
            }}
            onLoad={() => {
              setImageError(false);
            }}
          />
        </div>
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <span className="text-xs text-gray-400">No Image</span>
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="truncate text-sm font-medium text-gray-800">{item.title}</p>
        <p className="text-sm font-semibold text-gray-950">
          {formatCurrency(item.revenue, { showSign: true })}
        </p>
      </div>
    </div>
  );
}

export default function ClassSalesSection({ classSales }: ClassSalesSectionProps) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-base font-semibold text-gray-900">클래스별 매출</h2>

      {classSales.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-14">
          <div className="mb-4">
            <Image
              src={EmptyStateIcon}
              alt="운영 중인 클래스 없음"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          <div className="mb-6 text-center">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-400">
              운영 중인 클래스가 없어요.{'\n'}
              새로운 수업을 추가해보세요.
            </p>
          </div>
          <Link
            href="/seller/class-register"
            className="rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
          >
            클래스 등록하기
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {classSales.map((item) => (
            <ClassSalesItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
