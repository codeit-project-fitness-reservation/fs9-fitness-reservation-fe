import { useEffect, useState } from 'react';
import { User } from '@/types';
import { couponApi, CouponTemplate } from '@/lib/api/coupon';
import CreateCouponModal from './CreateCouponModal';

interface GiveCouponModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (couponId: string) => Promise<void>;
}

export default function GiveCouponModal({ user, onClose, onConfirm }: GiveCouponModalProps) {
  const [selectedCouponId, setSelectedCouponId] = useState('');
  const [coupons, setCoupons] = useState<CouponTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchCoupons = async () => {
    try {
      // 내가 생성한 쿠폰 목록 조회
      const data = await couponApi.getMyCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('쿠폰 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleConfirm = async () => {
    if (!selectedCouponId) {
      alert('쿠폰을 선택해주세요.');
      return;
    }
    setLoading(true);
    try {
      await onConfirm(selectedCouponId);
      onClose();
    } catch (error) {
      console.error('쿠폰 지급 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 쿠폰 생성 완료 시 호출될 콜백
  const handleCouponCreated = async () => {
    await fetchCoupons(); // 목록 갱신
    // 방금 생성한 쿠폰을 자동으로 선택하거나, 목록 최상단에 올릴 수 있음
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
        <div className="w-[343px] rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">쿠폰 지급</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <svg
                  width="24"
                  height="24"
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

              {/* 2. 지급 쿠폰 (Select + Create API) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-sm font-medium">
                    <span className="text-gray-800">지급 쿠폰</span>
                    <span className="text-blue-500">*</span>
                  </div>
                  {/* 쿠폰 생성 버튼 */}
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    + 새 쿠폰 만들기
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={selectedCouponId}
                    onChange={(e) => setSelectedCouponId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-8 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">쿠폰을 선택해주세요.</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.id} value={coupon.id}>
                        {coupon.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
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
                disabled={loading || !selectedCouponId}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-100 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                style={
                  selectedCouponId ? { backgroundColor: '#181D27', borderColor: '#181D27' } : {}
                }
              >
                {loading ? '지급 중...' : '지급하기'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 쿠폰 생성 모달 */}
      {isCreateModalOpen && (
        <CreateCouponModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleCouponCreated}
        />
      )}
    </>
  );
}
