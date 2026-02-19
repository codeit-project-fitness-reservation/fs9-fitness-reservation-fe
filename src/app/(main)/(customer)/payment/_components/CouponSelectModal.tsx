'use client';

import Image from 'next/image';
import Modal from '@/components/Modal';
import { UserCoupon } from '@/types';
import xCloseIcon from '@/assets/images/x-close.svg';

interface CouponSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCoupons: UserCoupon[];
  selectedCoupon: UserCoupon | null;
  onSelect: (coupon: UserCoupon | null) => void;
}

export default function CouponSelectModal({
  isOpen,
  onClose,
  availableCoupons,
  selectedCoupon,
  onSelect,
}: CouponSelectModalProps) {
  const formatDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const handleSelect = (coupon: UserCoupon) => {
    onSelect(coupon);
    onClose();
  };

  const handleRemove = () => {
    onSelect(null);
    onClose();
  };

  const header = (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <h2 className="text-lg font-semibold text-gray-900">쿠폰 선택</h2>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="닫기"
      >
        <Image src={xCloseIcon} alt="닫기" width={20} height={20} />
      </button>
    </div>
  );

  const body = (
    <div className="max-h-[calc(80vh-140px)] overflow-y-auto px-6 py-4">
      {availableCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-base text-gray-500">사용 가능한 쿠폰이 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {selectedCoupon && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center justify-between rounded-lg border-2 border-blue-500 bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100"
            >
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-gray-900">쿠폰 사용 안 함</p>
                <p className="text-sm text-gray-500">현재 선택된 쿠폰을 해제합니다</p>
              </div>
            </button>
          )}

          {availableCoupons.map((coupon) => {
            const isSelected = selectedCoupon?.id === coupon.id;
            const {
              name = '쿠폰',
              discountPoints = 0,
              discountPercentage = 0,
              expiresAt,
            } = coupon.template ?? {};

            return (
              <button
                key={coupon.id}
                type="button"
                onClick={() => handleSelect(coupon)}
                className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold text-gray-900">{name}</p>
                  <div className="flex items-center gap-2">
                    {discountPoints > 0 && (
                      <span className="text-sm font-medium text-blue-600">
                        -{discountPoints.toLocaleString()}P
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="text-sm font-medium text-blue-600">
                        -{discountPercentage}%
                      </span>
                    )}
                    {expiresAt && (
                      <span className="text-xs text-gray-500">~{formatDate(expiresAt)}</span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="flex size-6 items-center justify-center rounded-full bg-blue-500">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] w-[480px] max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-xl">
        {header}
        {body}
      </div>
    </Modal>
  );
}
