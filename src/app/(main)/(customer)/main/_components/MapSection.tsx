'use client';

import { Suspense } from 'react';
import Map from '../../centers/_components/Map';

export default function MapSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto w-full px-4 md:max-w-240">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 max-[640px]:text-xl">
          주변에서 좋아하는 활동을 찾아보세요
        </h2>
        <p className="mb-12 text-center text-base text-gray-600 max-[640px]:mb-8 max-[640px]:text-sm">
          취향에 따라서 원하는 모임을 골라보세요.
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-[500px] w-full max-[640px]:h-[300px]">
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-200" />}>
              <Map />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
