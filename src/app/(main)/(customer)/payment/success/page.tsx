'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import { pointApi } from '@/lib/api/point';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isChargingPoints, setIsChargingPoints] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId?: string;
    amount?: number;
    paymentKey?: string;
  } | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentKey = searchParams.get('paymentKey');

    if (orderId || amount) {
      setTimeout(() => {
        setPaymentInfo({
          orderId: orderId ?? undefined,
          amount: amount ? Number(amount) : undefined,
          paymentKey: paymentKey ?? undefined,
        });
      }, 0);
    }
  }, [searchParams]);

  /** 테스트 모드: paymentKey 없이 포인트만 적립 */
  async function chargePointsDirectly() {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!orderId || !amount) {
      alert('포인트 충전 정보가 올바르지 않습니다.');
      return;
    }

    setIsChargingPoints(true);
    try {
      await pointApi.charge({
        amount: Number(amount),
        paymentKey: `test-${orderId}`,
        orderId,
      });
      setIsConfirmed(true);
    } catch (err) {
      console.error('Point charge error:', err);
      alert('포인트 충전 중 오류가 발생했습니다.');
    } finally {
      setIsChargingPoints(false);
    }
  }

  // [고객] 토스 승인 + 포인트 충전
  async function confirmPayment() {
    if (!paymentInfo?.paymentKey || !paymentInfo?.orderId || paymentInfo?.amount == null) {
      alert('결제 정보가 올바르지 않습니다.');
      return;
    }

    setIsChargingPoints(true);
    try {
      await pointApi.chargeConfirm({
        paymentKey: paymentInfo.paymentKey,
        orderId: paymentInfo.orderId,
        amount: paymentInfo.amount,
      });
      setIsConfirmed(true);
    } catch (err) {
      console.error('Confirm/charge error:', err);
      const msg = err instanceof Error ? err.message : '포인트 충전 중 오류가 발생했습니다.';
      alert(msg);
    } finally {
      setIsChargingPoints(false);
    }
  }

  const hasPaymentKey = Boolean(paymentInfo?.paymentKey);
  const canConfirm =
    hasPaymentKey && paymentInfo?.orderId && paymentInfo?.amount != null && !isChargingPoints;

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
              포인트 충전을 완료했어요
            </h2>
            {paymentInfo && (
              <div className="mt-[60px] flex w-full flex-col gap-4 max-[640px]:mt-8 max-[640px]:gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                    충전 금액
                  </span>
                  <span className="pl-4 text-right text-[17px] font-medium text-[#4e5968] max-[640px]:text-sm">
                    {paymentInfo.amount?.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                    주문번호
                  </span>
                  <span className="pl-4 text-right text-[17px] font-medium break-all text-[#4e5968] max-[640px]:text-xs">
                    {paymentInfo.orderId}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 flex w-full flex-col gap-4 max-[640px]:mt-6 max-[640px]:gap-3">
              <BaseButton
                type="button"
                variant="primary"
                onClick={() => router.push('/my/points')}
                className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-base"
              >
                포인트 내역 보기
              </BaseButton>
              <BaseButton
                type="button"
                variant="secondary"
                onClick={() => router.push('/main')}
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
                결제 요청까지 성공했어요
              </h2>
              <h4 className="mt-2 text-center text-[17px] font-medium text-[#4e5968] max-[640px]:text-sm">
                결제 승인하고 포인트 충전을 완료해보세요.
              </h4>
            </div>
            {paymentInfo && (
              <div className="w-full space-y-4 rounded-lg bg-white p-4 max-[640px]:space-y-3 max-[640px]:p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                    주문번호
                  </span>
                  <span className="pl-4 text-right text-[17px] font-medium break-all text-[#4e5968] max-[640px]:text-xs">
                    {paymentInfo.orderId}
                  </span>
                </div>
                {paymentInfo.amount != null && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                      결제 금액
                    </span>
                    <span className="pl-4 text-right text-[17px] font-medium text-[#4e5968] max-[640px]:text-sm">
                      {paymentInfo.amount.toLocaleString()}원
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="w-full space-y-3 px-6 max-[640px]:px-0">
              {canConfirm && (
                <BaseButton
                  type="button"
                  variant="primary"
                  onClick={confirmPayment}
                  className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-base"
                  disabled={isChargingPoints}
                >
                  {isChargingPoints ? '포인트 충전 중...' : '결제 승인하기'}
                </BaseButton>
              )}
              {!hasPaymentKey && paymentInfo?.orderId && paymentInfo?.amount != null && (
                <BaseButton
                  type="button"
                  variant="secondary"
                  onClick={chargePointsDirectly}
                  className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-base"
                  disabled={isChargingPoints}
                >
                  {isChargingPoints ? '포인트 충전 중...' : '테스트 모드: 포인트 충전 완료'}
                </BaseButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
