'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
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
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('naverpay');
  const paymentWidgetsRef = useRef<unknown>(null);
  const paymentMethodWidgetRef = useRef<unknown>(null);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isWidgetRendered, setIsWidgetRendered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [widgetId] = useState(() => `payment-method-${Date.now()}`);
  const [agreementId] = useState(() => `agreement-${Date.now()}`);

  const amountNumber = amount === '' ? 0 : Number(amount);
  const formattedAmount = amountNumber > 0 ? amountNumber.toLocaleString() : '';

  const selectPaymentMethodInWidget = useCallback(
    async (methodId: PaymentMethodId) => {
      if (!paymentMethodWidgetRef.current) {
        return;
      }

      try {
        const widgetElement = document.getElementById(widgetId);
        if (!widgetElement) {
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 800));

        const methodTexts: Record<PaymentMethodId, string[]> = {
          naverpay: ['네이버페이', 'naver pay', 'naverpay', 'n pay', 'npay'],
          kakaopay: ['카카오페이', 'kakao pay', 'kakaopay'],
          mobile: ['휴대폰', 'mobile', '핸드폰'],
          payco: ['페이코', 'payco'],
          card: ['신용카드', '카드', 'card', 'credit'],
          smilepay: ['스마일페이', 'smile pay', 'smilepay'],
        };

        const targetTexts = methodTexts[methodId] || [];
        let found = false;
        const buttons = widgetElement.querySelectorAll(
          'button, [role="button"], a[tabindex], [data-testid], [class*="payment"], [class*="method"]',
        );

        for (const button of Array.from(buttons)) {
          const text = (button.textContent || '').toLowerCase().trim();
          const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
          const className = (button.className || '').toLowerCase();
          const id = (button.id || '').toLowerCase();

          const matches = targetTexts.some((targetText) => {
            const lowerTarget = targetText.toLowerCase();
            return (
              text === lowerTarget ||
              text.includes(lowerTarget) ||
              ariaLabel === lowerTarget ||
              ariaLabel.includes(lowerTarget) ||
              className.includes(lowerTarget) ||
              id.includes(lowerTarget)
            );
          });

          const excludesOtherMethods = targetTexts.every((targetText) => {
            const lowerTarget = targetText.toLowerCase();

            if (methodId === 'naverpay') {
              return !text.includes('카카오') && !text.includes('kakao');
            }

            if (methodId === 'kakaopay') {
              return !text.includes('네이버') && !text.includes('naver');
            }
            return true;
          });

          if (matches && excludesOtherMethods) {
            (button as HTMLElement).click();
            found = true;
            await new Promise((resolve) => setTimeout(resolve, 300));
            break;
          }
        }

        if (!found) {
          const allElements = widgetElement.querySelectorAll('*');

          for (const element of Array.from(allElements)) {
            const text = (element.textContent || '').toLowerCase().trim();
            const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
            const className = (element.className || '').toLowerCase();
            const id = (element.id || '').toLowerCase();
            const tagName = element.tagName.toLowerCase();

            const isClickable =
              tagName === 'button' ||
              tagName === 'a' ||
              element.getAttribute('role') === 'button' ||
              element.getAttribute('tabindex') !== null ||
              className.includes('clickable') ||
              className.includes('selectable');

            if (!isClickable) continue;

            const matches = targetTexts.some((targetText) => {
              const lowerTarget = targetText.toLowerCase();
              return (
                text === lowerTarget ||
                text.includes(lowerTarget) ||
                ariaLabel === lowerTarget ||
                ariaLabel.includes(lowerTarget) ||
                className.includes(lowerTarget) ||
                id.includes(lowerTarget)
              );
            });

            const excludesOtherMethods = targetTexts.every(() => {
              if (methodId === 'naverpay') {
                return !text.includes('카카오') && !text.includes('kakao');
              }
              if (methodId === 'kakaopay') {
                return !text.includes('네이버') && !text.includes('naver');
              }
              return true;
            });

            if (matches && excludesOtherMethods) {
              (element as HTMLElement).click();
              found = true;
              await new Promise((resolve) => setTimeout(resolve, 300));
              break;
            }
          }
        }
      } catch (error) {
        console.error('Payment method selection error:', error);
        throw error;
      }
    },
    [widgetId],
  );

  useEffect(() => {
    const initTossPayments = async () => {
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error('NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY is not set');
        }
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({
          customerKey: ANONYMOUS,
        });
        paymentWidgetsRef.current = widgets;
        setIsWidgetReady(true);
      } catch (error) {
        console.error('Toss Payments initialization error:', error);
        setIsWidgetReady(true);
      }
    };

    initTossPayments();
  }, []);

  useEffect(() => {
    const renderWidget = async () => {
      if (!paymentWidgetsRef.current || !isWidgetReady || amountNumber <= 0) {
        return;
      }

      if (paymentMethodWidgetRef.current) {
        return;
      }

      try {
        const widgetElement = document.getElementById(widgetId);
        const agreementElement = document.getElementById(agreementId);

        if (!widgetElement || !agreementElement) {
          return;
        }

        const widgets = paymentWidgetsRef.current as {
          setAmount: (amount: { currency: string; value: number }) => Promise<void>;
          renderPaymentMethods: (options: {
            selector: string;
            variantKey: string;
          }) => Promise<unknown>;
          renderAgreement: (options: { selector: string; variantKey: string }) => Promise<void>;
        };

        await widgets.setAmount({
          currency: 'KRW',
          value: amountNumber,
        });

        const [paymentMethodWidget] = await Promise.all([
          widgets.renderPaymentMethods({
            selector: `#${widgetId}`,
            variantKey: 'DEFAULT',
          }),
          widgets.renderAgreement({
            selector: `#${agreementId}`,
            variantKey: 'AGREEMENT',
          }),
        ]);

        paymentMethodWidgetRef.current = paymentMethodWidget;
        setIsWidgetRendered(true);

        setTimeout(() => {
          selectPaymentMethodInWidget(selectedMethod);
        }, 300);
      } catch (error) {
        console.error('Widget render error:', error);
        setIsWidgetRendered(false);
      }
    };

    const timer = setTimeout(() => {
      renderWidget();
    }, 100);

    return () => clearTimeout(timer);
  }, [isWidgetReady, widgetId, agreementId, selectedMethod, selectPaymentMethodInWidget]);

  useEffect(() => {
    const updateAmount = async () => {
      if (!paymentWidgetsRef.current || !paymentMethodWidgetRef.current || amountNumber <= 0) {
        return;
      }

      try {
        const widgets = paymentWidgetsRef.current as {
          setAmount: (amount: { currency: string; value: number }) => Promise<void>;
        };
        await widgets.setAmount({
          currency: 'KRW',
          value: amountNumber,
        });
      } catch (error) {
        console.error('Widget amount update error:', error);
      }
    };

    if (paymentMethodWidgetRef.current) {
      updateAmount();
    }
  }, [amountNumber]);
  useEffect(() => {
    if (!paymentMethodWidgetRef.current || !isWidgetReady) return;

    const timer = setTimeout(() => {
      selectPaymentMethodInWidget(selectedMethod);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedMethod, isWidgetReady, selectPaymentMethodInWidget]);

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

    if (!paymentMethodWidgetRef.current || !isWidgetRendered) {
      try {
        const widgetElement = document.getElementById(widgetId);
        const agreementElement = document.getElementById(agreementId);

        if (!widgetElement || !agreementElement) {
          alert('결제 위젯을 준비하는 중입니다. 잠시 후 다시 시도해주세요.');
          setIsProcessing(false);
          return;
        }

        const widgets = paymentWidgetsRef.current as {
          setAmount: (amount: { currency: string; value: number }) => Promise<void>;
          renderPaymentMethods: (options: {
            selector: string;
            variantKey: string;
          }) => Promise<unknown>;
          renderAgreement: (options: { selector: string; variantKey: string }) => Promise<void>;
        };

        await widgets.setAmount({
          currency: 'KRW',
          value: amountNumber,
        });

        const [paymentMethodWidget] = await Promise.all([
          widgets.renderPaymentMethods({
            selector: `#${widgetId}`,
            variantKey: 'DEFAULT',
          }),
          widgets.renderAgreement({
            selector: `#${agreementId}`,
            variantKey: 'AGREEMENT',
          }),
        ]);

        paymentMethodWidgetRef.current = paymentMethodWidget;
        setIsWidgetRendered(true);

        await new Promise((resolve) => setTimeout(resolve, 500));
        await selectPaymentMethodInWidget(selectedMethod);
      } catch (error) {
        console.error('Widget render error in handleCharge:', error);
        alert('결제 위젯을 준비하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setIsProcessing(false);
        return;
      }
    }

    try {
      const widgets = paymentWidgetsRef.current as {
        setAmount: (amount: { currency: string; value: number }) => Promise<void>;
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

      await widgets.setAmount({
        currency: 'KRW',
        value: amountNumber,
      });

      await selectPaymentMethodInWidget(selectedMethod);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const paymentMethodWidget = paymentMethodWidgetRef.current as {
          getSelectedPaymentMethod: () => Promise<unknown>;
        } | null;
        await paymentMethodWidget?.getSelectedPaymentMethod();
      } catch (error) {
        console.error('Payment method check error:', error);
      }

      await widgets.requestPayment({
        orderId,
        orderName: `포인트 충전 ${amountNumber.toLocaleString()}원`,
        customerName: '홍길동', // TODO: 실제 사용자 이름
        customerEmail: 'customer@example.com', // TODO: 실제 사용자 이메일
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

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">결제 수단</h2>

          <div className="flex flex-col gap-2">
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

        {amountNumber > 0 && (
          <div
            className="fixed top-0 left-0 z-0 opacity-0"
            style={{
              width: '400px',
              height: '1px',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <div id={widgetId} style={{ width: '400px', minHeight: '200px' }} />
            <div id={agreementId} style={{ width: '400px' }} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-30 w-full border-t border-gray-200 bg-white p-4">
        <div className="mx-auto w-full max-w-[480px]">
          <BaseButton
            type="button"
            variant="primary"
            disabled={isChargeDisabled || isProcessing}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isChargeDisabled && !isProcessing) {
                handleCharge();
              }
            }}
            className="w-full py-3 text-base"
          >
            {isProcessing ? '처리 중...' : '충전하기'}
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
