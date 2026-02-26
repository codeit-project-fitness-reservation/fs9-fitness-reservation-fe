'use client';

import { useRouter } from 'next/navigation';

interface PaymentPointsProps {
  availablePoints: number;
  paymentPoints: number;
}

export default function PaymentPoints({ availablePoints, paymentPoints }: PaymentPointsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-semibold text-gray-900">포인트 결제</label>
        <button
          type="button"
          onClick={() => router.push('/point-charge')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          충전하기
        </button>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-base text-gray-700">보유 포인트 {availablePoints.toLocaleString()}P</p>
      </div>
    </div>
  );
}
