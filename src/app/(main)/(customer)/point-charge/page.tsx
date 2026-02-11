'use client';

import { useState } from 'react';
import Image from 'next/image';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import xCloseIcon from '@/assets/images/x-close.svg';
import naverPayBadge from '@/assets/images/badge_npay.svg';
import kakaoPayBadge from '@/assets/images/badge_kakao.svg';

const QUICK_AMOUNTS = [10000, 50000, 100000] as const;
const MAX_AMOUNT = 100000;

type PaymentMethodId = 'naverpay' | 'kakaopay' | 'mobile' | 'payco' | 'card' | 'smilepay';

interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  badgeImage?: string;
  isLarge?: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'naverpay',
    label: '네이버페이',
    badgeImage: naverPayBadge,
    isLarge: true,
  },
  {
    id: 'kakaopay',
    label: '카카오페이',
    badgeImage: kakaoPayBadge,
    isLarge: true,
  },
  { id: 'mobile', label: '휴대폰' },
  { id: 'payco', label: '페이코' },
  { id: 'card', label: '신용카드' },
  { id: 'smilepay', label: '스마일페이' },
];

export default function PointChargePage() {
  const [amount, setAmount] = useState(''); // 숫자만 저장 (원 단위)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('naverpay');

  const amountNumber = amount === '' ? 0 : Number(amount);
  const formattedAmount = amountNumber > 0 ? amountNumber.toLocaleString() : '';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
    if (numbersOnly === '') {
      setAmount('');
      return;
    }

    const next = Math.min(Number(numbersOnly), MAX_AMOUNT);
    setAmount(String(next));
  };

  const handleAmountBlur = () => {
    if (amount === '') return;
    const next = Math.min(Number(amount) || 0, MAX_AMOUNT);
    setAmount(next > 0 ? String(next) : '');
  };

  const handleClearAmount = () => {
    setAmount('');
  };

  const handleQuickSet = (value: number) => {
    setAmount(String(Math.min(value, MAX_AMOUNT)));
  };

  const handleMax = () => {
    setAmount(String(MAX_AMOUNT));
  };

  const handleCharge = () => {
    if (amountNumber <= 0) return;
    // TODO: 실제 결제/포인트 충전 API 연동
    alert(
      `${amountNumber.toLocaleString()}원을 ${PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}로 충전합니다. (목업)`,
    );
  };

  const isChargeDisabled = amountNumber <= 0;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="포인트 충전" />

      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-6 px-4 py-6">
        {/* 충전 금액 */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">충전 금액</h2>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="충전할 금액을 입력해주세요"
              value={formattedAmount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
            />
            {amountNumber > 0 && (
              <button
                type="button"
                onClick={handleClearAmount}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                aria-label="금액 지우기"
              >
                <Image src={xCloseIcon} alt="지우기" width={16} height={16} />
              </button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleQuickSet(value)}
                className="rounded-lg border border-gray-200 bg-white py-2 text-center text-sm font-medium text-gray-900 hover:border-blue-500 hover:text-blue-600"
              >
                +{value === 10000 ? '1만' : value === 50000 ? '5만' : '10만'}
              </button>
            ))}
            <button
              type="button"
              onClick={handleMax}
              className="rounded-lg border border-gray-200 bg-white py-2 text-center text-sm font-medium text-gray-900 hover:border-blue-500 hover:text-blue-600"
            >
              +최대
            </button>
          </div>
        </section>

        {/* 결제 수단 */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">결제 수단</h2>

          <div className="flex flex-col gap-2">
            {/* 네이버페이와 카카오페이는 각각 전체 너비 */}
            {PAYMENT_METHODS.filter((m) => m.isLarge).map((method) => {
              const isSelected = method.id === selectedMethod;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex h-16 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {method.badgeImage && (
                    <Image
                      src={method.badgeImage}
                      alt=""
                      width={method.id === 'naverpay' ? 40 : 36}
                      height={16}
                      className="shrink-0"
                    />
                  )}
                  <span>{method.label}</span>
                </button>
              );
            })}

            {/* 나머지 결제 수단은 2열 그리드 */}
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.filter((m) => !m.isLarge).map((method) => {
                const isSelected = method.id === selectedMethod;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex h-14 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-30 w-full border-t border-gray-200 bg-white p-4">
        <div className="mx-auto w-full max-w-[480px]">
          <BaseButton
            type="button"
            variant="primary"
            disabled={isChargeDisabled}
            onClick={handleCharge}
            className="w-full py-3 text-base"
          >
            충전하기
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
