import { Suspense } from 'react';
import Map from './_components/Map';

export default function CentersPage() {
  return (
    <div className="relative h-[calc(100vh-56px)] w-full">
      <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-200" />}>
        <Map />
      </Suspense>
    </div>
  );
}
