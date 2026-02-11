'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseButton } from '@/components/common/BaseButton';

interface PaymentPointsProps {
  availablePoints: number;
  usedPoints: number;
  onPointsChange: (points: number) => void;
}

export default function PaymentPoints({
  availablePoints,
  usedPoints,
  onPointsChange,
}: PaymentPointsProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  const handleBlur = () => {
    if (inputValue === '' || Number(inputValue) === 0) {
      setInputValue('');
    } else {
      const points = Math.min(Number(inputValue), availablePoints);
      setInputValue(String(points));
    }
  };

  const handleApply = () => {
    if (inputValue === '') {
      return;
    }

    const raw = Number(inputValue);
    if (Number.isNaN(raw) || raw <= 0) {
      setInputValue('');
      onPointsChange(0);
      return;
    }

    const points = Math.min(raw, availablePoints);

    setInputValue(String(points));
    onPointsChange(points);
  };

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

      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-base text-gray-700">보유 포인트 {availablePoints.toLocaleString()}P</p>
        </div>
      </div>

      {usedPoints > 0 ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-base font-medium text-blue-600">-{usedPoints.toLocaleString()}P</p>
          </div>
          <BaseButton
            type="button"
            variant="secondary"
            onClick={() => {
              setInputValue('');
              onPointsChange(0);
            }}
            className="text-sm"
          >
            취소
          </BaseButton>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
            />
            <BaseButton
              type="button"
              variant="primary"
              onClick={handleApply}
              className="shrink-0 text-sm"
            >
              사용
            </BaseButton>
          </div>
        </div>
      )}
    </div>
  );
}
