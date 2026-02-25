'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import PaymentWidget from '@/components/payment/PaymentWidget';
import { userApi } from '@/lib/api/user';
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
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ method: string } | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const paymentWidgetsRef = useRef<unknown>(null);
  const paymentMethodWidgetRef = useRef<unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResult = await userApi.getMyProfile();
        setUserId(userResult.id);
        setCustomerName(userResult.nickname || '고객');
        setCustomerEmail(userResult.email || '');
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };
    void fetchUser();
  }, []);

  const amountNumber = amount === '' ? 0 : Number(amount);
  const formattedAmount = amountNumber > 0 ? amountNumber.toLocaleString() : '';

  const handlePaymentWidgetReady = (widgets: unknown, paymentMethodWidget: unknown) => {
    paymentWidgetsRef.current = widgets;
    paymentMethodWidgetRef.current = paymentMethodWidget;
    setIsWidgetReady(true);
  };

  const handlePaymentMethodSelect = (paymentMethod: unknown) => {
    console.log('handlePaymentMethodSelect called with:', paymentMethod);
    if (paymentMethod && typeof paymentMethod === 'object' && 'method' in paymentMethod) {
      const method = paymentMethod as { method: string };
      console.log('Setting selected payment method:', method.method);
      setSelectedPaymentMethod(method);
    } else {
      console.log('Invalid payment method format:', paymentMethod);
    }
  };

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

  const handleTestMode = () => {
    if (amountNumber <= 0) {
      alert('충전할 금액을 입력해주세요.');
      return;
    }

    const orderId = `point-charge-test-${Date.now()}`;
    router.push(`/payment/success?orderId=${orderId}&amount=${amountNumber}`);
  };

  const handleCharge = async () => {
    if (isProcessing) {
      console.log('Payment is already processing...');
      return;
    }

    if (amountNumber <= 0) {
      alert('충전할 금액을 입력해주세요.');
      return;
    }

    if (!paymentWidgetsRef.current || !isWidgetReady) {
      alert('결제 시스템을 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const widgets = paymentWidgetsRef.current as {
        requestPayment: (options: {
          orderId: string;
          orderName: string;
          customerName: string;
          customerEmail: string;
          successUrl: string;
          failUrl: string;
        }) => Promise<void>;
      };
      const orderId = `point-charge-${Date.now()}`;

      const paymentMethodWidget = paymentMethodWidgetRef.current as {
        getSelectedPaymentMethod: () => Promise<{ method: string } | null>;
      } | null;

      let paymentMethod = selectedPaymentMethod;
      if (!paymentMethod && paymentMethodWidget) {
        try {
          paymentMethod = await paymentMethodWidget.getSelectedPaymentMethod();
        } catch (error) {
          console.error('Failed to get selected payment method:', error);
        }
      }

      console.log('Final selectedPaymentMethod before requestPayment: ', paymentMethod);
      console.log('State selectedPaymentMethod: ', selectedPaymentMethod);

      await widgets.requestPayment({
        orderId,
        orderName: `포인트 충전 ${amountNumber.toLocaleString()}원`,
        customerName: customerName || '고객',
        customerEmail: customerEmail || 'customer@example.com',
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}&amount=${amountNumber}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
      });
    } catch (error: unknown) {
      console.error('Payment request error:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error) || '알 수 없는 오류';
      alert(`결제 요청 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isChargeDisabled = amountNumber <= 0;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="포인트 충전" />

      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-6 px-4 py-6">
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

        {amountNumber > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">결제 수단</h2>
            <PaymentWidget
              customerKey={userId || undefined}
              amount={amountNumber}
              onReady={handlePaymentWidgetReady}
              onPaymentMethodSelect={handlePaymentMethodSelect}
            />
          </section>
        )}
      </div>

      <div className="sticky bottom-0 z-30 w-full border-t border-gray-200 bg-white p-4">
        <div className="mx-auto w-full max-w-[480px] space-y-2">
          <BaseButton
            type="button"
            variant="primary"
            disabled={isChargeDisabled || isProcessing || !isWidgetReady}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isChargeDisabled && !isProcessing && isWidgetReady) {
                handleCharge();
              }
            }}
            className="w-full py-3 text-base"
          >
            {isProcessing ? '처리 중...' : '충전하기'}
          </BaseButton>
          <BaseButton
            type="button"
            variant="secondary"
            disabled={isChargeDisabled}
            onClick={handleTestMode}
            className="w-full py-2 text-sm"
          >
            테스트 모드: 성공 페이지로 이동
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
