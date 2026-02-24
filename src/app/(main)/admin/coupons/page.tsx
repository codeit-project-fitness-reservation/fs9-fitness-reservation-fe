'use client';

import { useState, useEffect, useCallback } from 'react';
import { couponApi, CouponTemplate, CreateCouponTemplateInput } from '@/lib/api/coupon';
import CouponCard from './_components/CouponCard';
import CreateCouponModal from '../users/_components/CreateCouponModal';

// 플러스 아이콘
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 4V16M4 10H16"
      stroke="white"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 수정 모달 (인라인으로 간단하게 구현)
interface EditCouponModalProps {
  coupon: CouponTemplate;
  onClose: () => void;
  onUpdated: () => void;
}

function EditCouponModal({ coupon, onClose, onUpdated }: EditCouponModalProps) {
  const [name, setName] = useState(coupon.name);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      await couponApi.updateCoupon(coupon.id, { name });
      onUpdated();
      onClose();
    } catch {
      alert('쿠폰 수정 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex w-[400px] flex-col gap-[24px] rounded-[24px] bg-white p-[24px] shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] leading-[28px] font-semibold text-gray-900">쿠폰 수정</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-[8px] p-[8px] text-gray-400 transition-colors hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-gray-800">쿠폰 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[44px] w-full rounded-[8px] border border-gray-300 px-[12px] py-[10px] text-[16px] text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-[8px]">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-gray-300 bg-white px-[18px] py-[12px] text-[16px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            className="flex-1 rounded-[8px] bg-[#2970FF] px-[18px] py-[12px] text-[16px] font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? '수정 중...' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponTemplate | null>(null);

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await couponApi.getMyCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?\n삭제된 쿠폰은 복구할 수 없습니다.')) return;
    try {
      await couponApi.deleteCoupon(id);
      await fetchCoupons();
    } catch {
      alert('쿠폰 삭제 실패');
    }
  };

  return (
    <div className="flex flex-col gap-[31px]">
      {/* 쿠폰 만들기 버튼 */}
      <div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-[6px] rounded-[8px] border-2 border-white/20 bg-[#2970FF] px-[18px] py-[12px] text-[16px] font-semibold text-white transition-colors hover:bg-blue-600"
        >
          <PlusIcon />
          쿠폰 만들기
        </button>
      </div>

      {/* 쿠폰 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-[12px] py-20 text-gray-400">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18C6 16.3431 7.34315 15 9 15H39C40.6569 15 42 16.3431 42 18V20.25C40.3431 20.25 39 21.5931 39 23.25C39 24.9069 40.3431 26.25 42 26.25V29.25C42 30.9069 40.6569 32.25 39 32.25H9C7.34315 32.25 6 30.9069 6 29.25V26.25C7.65685 26.25 9 24.9069 9 23.25C9 21.5931 7.65685 20.25 6 20.25V18Z"
              stroke="#A4A7AE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[16px]">등록된 쿠폰이 없습니다.</p>
          <p className="text-[14px]">위의 버튼을 눌러 첫 번째 쿠폰을 만들어보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-[24px]">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onEdit={setEditingCoupon}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 생성 모달 */}
      {isCreateModalOpen && (
        <CreateCouponModal onClose={() => setIsCreateModalOpen(false)} onCreated={fetchCoupons} />
      )}

      {/* 수정 모달 */}
      {editingCoupon && (
        <EditCouponModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onUpdated={fetchCoupons}
        />
      )}
    </div>
  );
}
