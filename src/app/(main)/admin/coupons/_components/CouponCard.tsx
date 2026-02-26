'use client';

import { CouponTemplate } from '@/lib/api/coupon';
import { format } from 'date-fns';

// 티켓 아이콘 (SVG)
const TicketIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 12C4 10.8954 4.89543 10 6 10H26C27.1046 10 28 10.8954 28 12V13.5C26.8954 13.5 26 14.3954 26 15.5C26 16.6046 26.8954 17.5 28 17.5V19.5C28 20.6046 27.1046 21.5 26 21.5H6C4.89543 21.5 4 20.6046 4 19.5V17.5C5.10457 17.5 6 16.6046 6 15.5C6 14.3954 5.10457 13.5 4 13.5V12Z"
      stroke="#2970FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 구분선 아이콘
const DividerIcon = () => (
  <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0.5" y1="0" x2="0.5" y2="12" stroke="#D5D7DA" />
  </svg>
);

interface CouponCardProps {
  coupon: CouponTemplate;
  onEdit: (coupon: CouponTemplate) => void;
  onDelete: (id: string) => void;
}

export default function CouponCard({ coupon, onEdit, onDelete }: CouponCardProps) {
  // 할인 정보 표시
  const discountLabel =
    coupon.discountPercentage != null
      ? `${coupon.discountPercentage}% 할인`
      : coupon.discountPoints != null
        ? `${coupon.discountPoints.toLocaleString()}P 할인`
        : '할인 정보 없음';

  // 만료일 표시
  const expiryLabel = coupon.expiresAt
    ? `만료: ${format(new Date(coupon.expiresAt), 'yyyy. MM. dd')}`
    : '만료일 없음';

  return (
    <div className="flex h-[160px] items-start justify-between overflow-hidden rounded-[12px] bg-white px-[24px] py-[20px] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.06)]">
      {/* 왼쪽: 쿠폰 정보 */}
      <div className="flex flex-col gap-[14px]">
        <div className="flex flex-col gap-[2px]">
          <p className="text-[20px] leading-[30px] font-semibold text-gray-800">{coupon.name}</p>
          <p className="text-[16px] leading-[24px] font-bold text-[#155EEF]">{discountLabel}</p>
        </div>
        <div className="flex flex-col text-[12px] leading-[18px] font-medium text-gray-400">
          <p>제한 없음</p>
          <p>{expiryLabel}</p>
        </div>
      </div>

      {/* 오른쪽: 수정/삭제 + 아이콘 */}
      <div className="flex h-full flex-col items-end justify-between">
        {/* 수정 | 삭제 */}
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => onEdit(coupon)}
            className="text-[14px] leading-[20px] font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            수정
          </button>
          <DividerIcon />
          <button
            onClick={() => onDelete(coupon.id)}
            className="text-[14px] leading-[20px] font-medium text-gray-400 transition-colors hover:text-red-500"
          >
            삭제
          </button>
        </div>

        {/* 티켓 아이콘 원 */}
        <div className="relative h-[64px] w-[64px] rounded-full bg-[#EFF4FF]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <TicketIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
