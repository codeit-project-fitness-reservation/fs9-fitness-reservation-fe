'use client';

import Image from 'next/image';
import searchFeature from '@/assets/images/search_feature.svg';
import calFeature from '@/assets/images/cal_feature.svg';
import cardFeature from '@/assets/images/card_feature.svg';

export default function FeaturesSection() {
  return (
    <section className="bg-blue-400 py-16 md:py-20">
      <div className="mx-auto w-full md:max-w-240">
        <h2 className="mb-2 text-center text-2xl font-bold text-white max-[640px]:text-xl">
          다양한 분야의 모임을 만나보세요
        </h2>
        <p className="mb-12 text-center text-base text-blue-100 max-[640px]:mb-8 max-[640px]:text-sm">
          취향에 따라서 원하는 모임을 골라보세요.
        </p>
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 그라데이션 라인 */}
          <div
            className="absolute top-8 left-0 hidden h-px w-full md:block"
            style={{
              background:
                'linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 50.48%, rgba(255, 255, 255, 0.00) 100%)',
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 max-[640px]:size-12">
              <Image
                src={searchFeature}
                alt="검색"
                width={64}
                height={64}
                className="max-[640px]:h-12 max-[640px]:w-12"
              />
            </div>
            <p className="text-center text-base font-medium text-white max-[640px]:text-sm">
              당신에게 어울리는
              <br />
              서비스를 찾으세요.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 max-[640px]:size-12">
              <Image
                src={calFeature}
                alt="캘린더"
                width={64}
                height={64}
                className="max-[640px]:h-12 max-[640px]:w-12"
              />
            </div>
            <p className="text-center text-base font-medium text-white max-[640px]:text-sm">
              예약 현황을
              <br />한 눈에 알 수 있어요.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 max-[640px]:size-12">
              <Image
                src={cardFeature}
                alt="결제"
                width={64}
                height={64}
                className="max-[640px]:h-12 max-[640px]:w-12"
              />
            </div>
            <p className="text-center text-base font-medium text-white max-[640px]:text-sm">
              복잡한 과정 없이
              <br />
              바로 결제할 수 있어요
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
