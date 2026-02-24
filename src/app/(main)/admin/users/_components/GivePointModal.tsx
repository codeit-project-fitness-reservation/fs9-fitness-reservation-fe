import { useState } from 'react';
import { User } from '@/types';

interface GivePointModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (amount: number, memo: string) => Promise<void>;
}

export default function GivePointModal({ user, onClose, onConfirm }: GivePointModalProps) {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) === 0) {
      alert('유효한 포인트를 입력해주세요.');
      return;
    }
    if (!memo.trim()) {
      alert('지급 사유를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(Number(amount), memo);
      onClose();
    } catch (error) {
      console.error('포인트 지급 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = amount && !isNaN(Number(amount)) && Number(amount) !== 0 && memo.trim();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-[343px] rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">포인트 지급</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4">
            {/* 1. 지급 대상 (Readonly) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-0.5 text-sm font-medium">
                <span className="text-gray-800">지급 대상</span>
                <span className="text-blue-500">*</span>
              </div>
              <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-500">
                {user.nickname} ({user.id})
              </div>
            </div>

            {/* 2. 지급 포인트 (Input) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-0.5 text-sm font-medium">
                <span className="text-gray-800">지급 포인트</span>
                <span className="text-blue-500">*</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="지급할 포인트를 입력해주세요"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">* 음수 입력 시 포인트가 차감됩니다.</p>
            </div>

            {/* 3. 지급 사유 (Input) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-0.5 text-sm font-medium">
                <span className="text-gray-800">지급 사유</span>
                <span className="text-blue-500">*</span>
              </div>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="사유를 입력해주세요"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-2 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !isFormValid}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-100 py-2.5 text-sm font-semibold text-gray-400 hover:bg-gray-200 active:bg-gray-300 active:text-gray-700 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
              style={
                isFormValid
                  ? { backgroundColor: '#181D27', color: '#FFFFFF', borderColor: '#181D27' }
                  : {}
              }
            >
              {loading ? '처리 중...' : '지급하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
