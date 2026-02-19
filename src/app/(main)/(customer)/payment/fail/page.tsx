'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';

export default function PaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const handleRetry = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/main');
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="결제 실패" />

      <div className="mx-auto flex w-full max-w-[540px] flex-col items-center justify-center gap-6 px-4 py-8 max-[640px]:px-4 max-[640px]:py-6 md:px-6 md:py-12">
        <img
          src="https://static.toss.im/lotties/error-spot-apng.png"
          width={120}
          height={120}
          alt="에러"
          className="max-[640px]:h-20 max-[640px]:w-20"
        />
        <h2 className="mt-8 mb-0 text-center text-2xl font-bold text-[#191f28] max-[640px]:mt-6 max-[640px]:text-xl">
          결제를 실패했어요
        </h2>

        {(errorCode || errorMessage) && (
          <div className="mt-[60px] flex w-full flex-col gap-4 max-[640px]:mt-8 max-[640px]:gap-3">
            {errorCode && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                  code
                </span>
                <span
                  id="error-code"
                  className="pl-4 text-right text-[17px] font-medium wrap-break-word text-[#4e5968] max-[640px]:pl-2 max-[640px]:text-xs"
                >
                  {errorCode}
                </span>
              </div>
            )}
            {errorMessage && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-[17px] font-semibold text-[#333d48] max-[640px]:text-sm">
                  message
                </span>
                <span
                  id="error-message"
                  className="pl-4 text-right text-[17px] font-medium wrap-break-word text-[#4e5968] max-[640px]:pl-2 max-[640px]:text-xs"
                >
                  {errorMessage}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex w-full flex-col gap-4 max-[640px]:mt-6 max-[640px]:gap-3">
          <BaseButton
            type="button"
            variant="primary"
            onClick={handleRetry}
            className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-base"
          >
            다시 시도
          </BaseButton>
          <div className="flex gap-4 max-[640px]:flex-col max-[640px]:gap-3">
            <a
              href="https://docs.tosspayments.com/reference/error-codes"
              target="_blank"
              rel="noreferrer noopener"
              className="flex-1"
            >
              <BaseButton
                type="button"
                variant="secondary"
                className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-sm"
              >
                에러코드 문서보기
              </BaseButton>
            </a>
            <a
              href="https://techchat.tosspayments.com"
              target="_blank"
              rel="noreferrer noopener"
              className="flex-1"
            >
              <BaseButton
                type="button"
                variant="secondary"
                className="w-full py-[11px] text-[17px] font-semibold max-[640px]:py-3 max-[640px]:text-sm"
              >
                실시간 문의하기
              </BaseButton>
            </a>
          </div>
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
    </div>
  );
}
