'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId?: string;
    amount?: number;
    paymentKey?: string;
  } | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentKey = searchParams.get('paymentKey');

    if (orderId) {
      // Use setTimeout to avoid setState in effect warning
      setTimeout(() => {
        setPaymentInfo({
          orderId,
          amount: amount ? Number(amount) : undefined,
          paymentKey: paymentKey || undefined,
        });
      }, 0);
    }
  }, [searchParams]);

  async function confirmPayment() {
    if (!paymentInfo?.paymentKey || !paymentInfo?.orderId || !paymentInfo?.amount) {
      alert('결제 정보가 올바르지 않습니다.');
      return;
    }

    try {
      const params = new URLSearchParams({
        paymentKey: paymentInfo.paymentKey,
        orderId: paymentInfo.orderId,
        amount: String(paymentInfo.amount),
      });

      const response = await fetch(`/api/payments/confirm?${params.toString()}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Payment confirmation result:', result);
        setIsConfirmed(true);
      } else {
        const errorData = await response.json();
        alert(`결제 승인 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      alert('결제 승인 중 오류가 발생했습니다.');
    }
  }

  const handleGoHome = () => {
    router.push('/main');
  };

  const handleGoToReservations = () => {
    router.push('/reservations');
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="결제 완료" />

      <div className="mx-auto flex w-full max-w-[540px] flex-col items-center justify-center gap-6 px-4 py-8 max-[640px]:px-4 max-[640px]:py-6 md:px-6 md:py-12">
        {isConfirmed ? (
          <div className="flex w-full flex-col items-center">
            <img
              src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
              width={120}
              height={120}
              alt="결제 완료"
              className="max-[640px]:h-20 max-[640px]:w-20"
            />
            <h2 className="mt-8 mb-0 text-center text-2xl font-bold text-[#191f28] max-[640px]:mt-6 max-[640px]:text-xl">
              결제를 완료했어요
            </h2>
            {paymentInfo && (
              <div className="mt-[60px] flex w-full flex-col gap-4 max-[640px]:mt-8 max-[640px]:gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                    결제 금액
                  </span>
                  <span className="pl-4 text-right text-[17px] font-medium wrap-break-word text-[#4e5968] max-[640px]:pl-2 max-[640px]:text-sm">
                    {paymentInfo.amount?.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                    주문번호
                  </span>
                  <span className="pl-4 text-right text-[17px] font-medium wrap-break-word text-[#4e5968] max-[640px]:pl-2 max-[640px]:text-xs">
                    {paymentInfo.orderId}
                  </span>
                </div>
                {paymentInfo.paymentKey && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                      paymentKey
                    </span>
                    <span className="pl-4 text-right text-[17px] font-medium break-all text-[#4e5968] max-[640px]:pl-2 max-[640px]:text-xs">
                      {paymentInfo.paymentKey}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex w-full flex-col gap-4 max-[640px]:mt-6 max-[640px]:gap-3">
              <BaseButton
                type="button"
                variant="primary"
                onClick={handleGoToReservations}
                className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-base"
              >
                예약 내역 보기
              </BaseButton>
              <BaseButton
                type="button"
                variant="secondary"
                onClick={handleGoHome}
                className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-base"
              >
                홈으로 가기
              </BaseButton>
            </div>
          </div>
        ) : (
          <div className="mt-[72px] flex h-[400px] w-full flex-col items-center justify-between max-[640px]:mt-8 max-[640px]:h-auto max-[640px]:gap-6">
            <div className="flex flex-col items-center">
              <img
                src="https://static.toss.im/lotties/loading-spot-apng.png"
                width={120}
                height={120}
                alt="로딩"
                className="max-[640px]:h-20 max-[640px]:w-20"
              />
              <h2 className="mt-8 mb-0 text-center text-2xl font-bold text-[#191f28] max-[640px]:mt-6 max-[640px]:text-xl">
                결제 요청까지 성공했어요.
              </h2>
              <h4 className="mt-2 text-center text-[17px] font-medium text-[#4e5968] max-[640px]:text-sm">
                결제 승인하고 완료해보세요.
              </h4>
            </div>
            {paymentInfo && (
              <div className="w-full space-y-4 rounded-lg bg-white p-4 max-[640px]:space-y-3 max-[640px]:p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                    주문번호
                  </span>
                  <span className="pl-4 text-right text-[17px] font-medium wrap-break-word text-[#4e5968] max-[640px]:pl-2 max-[640px]:text-xs">
                    {paymentInfo.orderId}
                  </span>
                </div>
                {paymentInfo.amount && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                      결제 금액
                    </span>
                    <span className="pl-4 text-right text-[17px] font-medium wrap-break-word text-[#4e5968] max-[640px]:pl-2 max-[640px]:text-sm">
                      {paymentInfo.amount.toLocaleString()}원
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="w-full px-6 max-[640px]:px-0">
              <BaseButton
                type="button"
                variant="primary"
                onClick={confirmPayment}
                className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-base"
                disabled={!paymentInfo?.paymentKey || !paymentInfo?.orderId || !paymentInfo?.amount}
              >
                결제 승인하기
              </BaseButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
