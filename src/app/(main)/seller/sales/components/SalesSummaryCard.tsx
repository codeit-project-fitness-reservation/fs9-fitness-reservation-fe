'use client';

import Image from 'next/image';
import icCoins from '@/assets/images/coins-stacked-01.svg';
import { SalesSummary } from '@/types';
import { formatCurrency } from '@/lib/utils/format';

interface SalesSummaryCardProps {
  summary: SalesSummary;
}

export default function SalesSummaryCard({ summary }: SalesSummaryCardProps) {
  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white px-6 py-5">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-400">총 매출</p>
            <p className="text-[24px] leading-tight font-bold text-gray-800">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>

          <div className="space-y-1.5 text-xs font-medium text-gray-500">
            <p>쿠폰 할인: {formatCurrency(summary.couponDiscount)}</p>
            <p>환불/취소: {formatCurrency(summary.refundAmount)}</p>
            <p>
              순매출(정산액):{' '}
              <span className="font-medium text-blue-600">
                {formatCurrency(summary.netRevenue)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <Image src={icCoins} alt="sales icon" width={32} height={32} />
        </div>
      </div>
    </div>
  );
}
