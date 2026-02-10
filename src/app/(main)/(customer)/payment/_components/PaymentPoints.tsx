'use client';

import { useState, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing && usedPoints > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(String(usedPoints));
    } else if (!isEditing && usedPoints === 0) {
      setInputValue('');
    }
  }, [usedPoints, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
    setIsEditing(true);

    const points = value === '' ? 0 : Math.min(Number(value), availablePoints);
    onPointsChange(points);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // blur 시 최종 값 동기화
    if (inputValue === '' || Number(inputValue) === 0) {
      setInputValue('');
      onPointsChange(0);
    } else {
      const points = Math.min(Number(inputValue), availablePoints);
      setInputValue(String(points));
      onPointsChange(points);
    }
  };

  const handleUseAll = () => {
    setInputValue(String(availablePoints));
    setIsEditing(false);
    onPointsChange(availablePoints);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-semibold text-gray-900">포인트 결제</label>
        <button
          type="button"
          onClick={() => router.push('/payment')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          충전하기 &gt;
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-base text-gray-700">보유 포인트 {availablePoints.toLocaleString()}P</p>
        </div>
      </div>

      {usedPoints > 0 && !isEditing ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-base font-medium text-blue-600">-{usedPoints.toLocaleString()}P</p>
          </div>
          <BaseButton
            type="button"
            variant="secondary"
            onClick={() => {
              setInputValue('');
              setIsEditing(false);
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
              onFocus={() => setIsEditing(true)}
              className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
            />
            <BaseButton
              type="button"
              variant="primary"
              onClick={handleUseAll}
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
