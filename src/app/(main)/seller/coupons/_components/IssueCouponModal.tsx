'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { couponApi, CouponTemplate } from '@/lib/api/coupon';
import InputField from '@/components/Field/InputField';
import icClose from '@/assets/images/x-close.svg';
import icChevronDown from '@/assets/images/chevron-down.svg';

interface IssueCouponModalProps {
  selectedTemplateId?: string;
  coupon?: CouponTemplate;
  onClose: () => void;
  onSuccess: () => void;
}

export default function IssueCouponModal({ onClose, onSuccess }: IssueCouponModalProps) {
  const [coupons, setCoupons] = useState<CouponTemplate[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const data = await couponApi.getCouponTemplates();
        const list = Array.isArray(data) ? data : [];
        setCoupons(list);
      } catch {
        setCoupons([]);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchCoupons();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCoupon = coupons.find((c) => c.id === selectedCouponId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setSubmitError('닉네임을 입력해주세요.');
      return;
    }
    if (!selectedCouponId) {
      setSubmitError('쿠폰을 선택해주세요.');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await couponApi.issueCoupon({
        templateId: selectedCouponId,
        nickname: nickname.trim(),
        ...(userId.trim() && { userId: userId.trim() }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '쿠폰 지급에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = !!nickname.trim() && !!selectedCouponId;

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[200px] w-[343px] items-center justify-center rounded-[24px] bg-white p-6 md:w-[520px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-[343px] flex-col gap-12 rounded-[24px] bg-white p-6 shadow-xl md:w-[520px] md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg leading-7 font-semibold text-[#181D27]">쿠폰 지급</h2>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg p-2 hover:bg-gray-100"
          aria-label="닫기"
        >
          <Image src={icClose} alt="" width={20} height={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          {/* 지급 대상 - 닉네임 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm leading-5 font-medium text-[#252B37]">
              지급 대상 <span className="text-[#2970FF]">*</span>
            </label>
            <InputField
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              error={submitError ?? undefined}
              className="rounded-lg border-[#D5D7DA]"
            />
          </div>

          {/* 아이디 (선택) */}
          <div className="flex flex-col gap-1.5">
            <InputField
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="rounded-lg border-[#D5D7DA]"
            />
          </div>

          {/* 지급 쿠폰 - 드롭다운 */}
          <div className="relative flex flex-col gap-1.5" ref={dropdownRef}>
            <label className="text-sm leading-5 font-medium text-[#252B37]">
              지급 쿠폰 <span className="text-[#2970FF]">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 text-left transition-colors ${
                isDropdownOpen ? 'border-[#2970FF]' : 'border-[#D5D7DA]'
              }`}
            >
              <p
                className={`flex-1 text-base ${selectedCoupon ? 'text-[#252B37]' : 'text-gray-500'}`}
              >
                {selectedCoupon ? selectedCoupon.name : '쿠폰을 선택해주세요.'}
              </p>
              <Image
                src={icChevronDown}
                alt=""
                width={16}
                height={16}
                className={`shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && coupons.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-[240px] overflow-y-auto rounded-lg border border-[#E9EAEB] bg-white py-1 shadow-lg">
                {coupons.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCouponId(c.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 text-left text-base text-[#252B37] hover:bg-gray-50 ${
                      selectedCouponId === c.id ? 'bg-[#EFF4FF] font-medium' : ''
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-lg border border-[#D5D7DA] bg-white px-[18px] py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`flex flex-1 items-center justify-center rounded-lg px-[18px] py-3 text-base font-semibold transition-all ${
              isValid && !isSubmitting
                ? 'bg-[#2970FF] text-white hover:bg-[#155EEF]'
                : 'cursor-not-allowed border border-[#E9EAEB] bg-[#F5F5F5] text-[#A4A7AE]'
            }`}
          >
            {isSubmitting ? '지급 중...' : '지급하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
