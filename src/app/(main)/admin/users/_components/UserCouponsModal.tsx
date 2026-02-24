'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { couponApi, UserCoupon } from '@/lib/api/coupon';
import couponIcon from '@/assets/images/coupon.svg';

type SvgImport = string | { src: string };
const getSvgSrc = (svg: SvgImport): string => (typeof svg === 'string' ? svg : svg.src);

const formatDate = (date: string | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

const formatDiscount = (coupon: UserCoupon): string => {
  if (coupon.discountPercentage && coupon.discountPercentage > 0) {
    return `${coupon.discountPercentage}% 할인`;
  }
  if (coupon.discountPoints && coupon.discountPoints > 0) {
    return `${coupon.discountPoints.toLocaleString()}원 할인`;
  }
  return '할인 정보 없음';
};

const formatCondition = (coupon: UserCoupon): string => {
  if (coupon.discountPoints && coupon.discountPoints >= 10000) {
    return '20,000원 이상 결제 시';
  }
  return '제한 없음';
};

interface UserCouponsModalProps {
  userId: string;
  userNickname: string;
  onClose: () => void;
}

export default function UserCouponsModal({ userId, userNickname, onClose }: UserCouponsModalProps) {
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await couponApi.getUserCoupons(userId);
        setCoupons(data ?? []);
      } catch (error) {
        console.error('쿠폰 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      <div className="flex h-[80vh] w-[480px] max-w-[95vw] flex-col overflow-hidden rounded-3xl bg-gray-50 shadow-xl">
        {/* 헤더 */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="닫기"
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
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <p className="text-base font-semibold text-gray-900">쿠폰함</p>
          <div className="w-9" />
        </div>

        {/* 바디 */}
        <div className="flex flex-col gap-4 overflow-y-auto p-6">
          {loading ? (
            <p className="py-12 text-center text-sm text-gray-400">불러오는 중...</p>
          ) : (
            <>
              <p className="text-base font-medium text-gray-600">
                {userNickname}님 보유쿠폰 {coupons.length}장
              </p>

              {coupons.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-400">보유한 쿠폰이 없습니다.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="flex w-full items-center justify-between rounded-2xl bg-white p-8 shadow-sm"
                      style={{
                        boxShadow: '0 1px 8px 0 rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {coupon.couponName || '쿠폰'}
                        </h3>
                        <p className="text-base font-bold text-blue-600">
                          {formatDiscount(coupon)}
                        </p>
                        <p className="text-xs text-gray-400">{formatCondition(coupon)}</p>
                        {coupon.expiresAt && (
                          <p className="text-xs text-gray-400">
                            만료: {formatDate(coupon.expiresAt)}
                          </p>
                        )}
                        {coupon.usedAt && (
                          <p className="text-xs text-red-400">
                            사용완료: {formatDate(coupon.usedAt)}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">
                        <Image
                          src={getSvgSrc(couponIcon as SvgImport)}
                          alt="쿠폰"
                          width={64}
                          height={64}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
