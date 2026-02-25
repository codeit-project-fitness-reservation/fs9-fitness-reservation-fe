'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CreateButton from '@/components/common/CreateButton';
import { useModal } from '@/providers/ModalProvider';
import { couponApi, CouponTemplate } from '@/lib/api/coupon';
import CreateCouponModal from './_components/CreateCouponModal';
import IssueCouponModal from './_components/IssueCouponModal';
import couponIcon from '@/assets/images/ticket-01.svg';
import emptyStateIcon from '@/assets/images/Empty State.svg';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

const formatDiscount = (coupon: CouponTemplate): string => {
  if (coupon.discountPoints != null && coupon.discountPoints > 0)
    return `${coupon.discountPoints.toLocaleString()}원 할인`;
  if (coupon.discountPercentage != null && coupon.discountPercentage > 0)
    return `${coupon.discountPercentage}% 할인`;
  return '할인 정보 없음';
};

const formatCondition = (coupon: CouponTemplate): string => {
  const amount = coupon.discountPoints ?? 0;
  const isAmount = coupon.discountType === 'AMOUNT' || coupon.discountPoints != null;
  if (isAmount && amount >= 10000) return '20,000원 이상 결제 시';
  return '제한 없음';
};

export default function CouponsPage() {
  const { openModal } = useModal();
  const [coupons, setCoupons] = useState<CouponTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const data = await couponApi.getCouponTemplates();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = () => {
    openModal(CreateCouponModal, { onClose: () => {}, onSuccess: fetchCoupons });
  };

  const handleEditCoupon = (coupon: CouponTemplate) => {
    openModal(CreateCouponModal, {
      onClose: () => {},
      onSuccess: fetchCoupons,
      couponId: coupon.id,
      initialData: coupon,
    });
  };

  const handleDeleteCoupon = async (templateId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await couponApi.deleteCouponTemplate(templateId);
      fetchCoupons();
    } catch {
      alert('쿠폰 삭제에 실패했습니다.');
    }
  };
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-240 flex-col bg-gray-50">
      <SimpleHeader title="쿠폰 관리" />

      <main className="flex w-full flex-1 flex-col px-4 pt-6 pb-32 md:px-8 md:pb-10">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-20">
            <Image
              src={emptyStateIcon}
              alt="Empty"
              width={156}
              height={156}
              className="mb-4 h-39 w-39 md:h-39 md:w-39"
            />
            <p className="text-base font-normal text-gray-400">생성된 쿠폰이 없어요.</p>
            <p className="text-base font-normal text-gray-400">새 쿠폰을 만들어보세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:gap-8">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                onClick={() =>
                  openModal(IssueCouponModal, {
                    selectedTemplateId: coupon.id,
                    coupon,
                    onClose: () => {},
                    onSuccess: fetchCoupons,
                  })
                }
                className="flex h-36.5 w-full cursor-pointer items-start justify-between rounded-xl bg-white px-5 py-4 shadow-[0_1px_8px_0_rgba(0,0,0,0.06)] md:h-48 md:rounded-2xl md:px-8 md:py-5"
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-semibold text-gray-800 md:text-2xl">
                      {coupon.name}
                    </h3>
                    <p className="text-sm font-bold text-blue-600 md:text-xl">
                      {formatDiscount(coupon)}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-gray-400 md:text-base">
                    <p>{formatCondition(coupon)}</p>
                    <p className="mt-0.5">만료: {formatDate(coupon.expiresAt ?? undefined)}</p>
                  </div>
                </div>

                <div className="flex h-full flex-col items-end justify-between">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                      수정
                    </button>
                    <div className="h-3 w-px bg-gray-200" />
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-[14px] font-medium text-gray-400"
                    >
                      삭제
                    </button>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFF4FF] md:h-16 md:w-16">
                    <Image
                      src={couponIcon}
                      alt="Coupon"
                      width={32}
                      height={32}
                      className="h-6 w-6 md:h-8 md:w-8"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateButton onClick={handleCreateCoupon} label="쿠폰 만들기" />
    </div>
  );
}
