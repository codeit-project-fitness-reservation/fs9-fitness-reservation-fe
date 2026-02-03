'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Map from './_components/Map';
import { Center } from '@/types';
import { MOCK_CENTER_LIST } from '@/mocks/centers';

export default function CentersPage() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<
    { lat: number; lng: number } | undefined
  >();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => {},
      );
    }
  }, []);

  if (!currentLocation) {
    return (
      <div className="flex h-[calc(100vh-56px)] w-full items-center justify-center">
        <p className="text-center text-sm text-gray-400">
          위치 정보를 켜면 주변 센터를 볼 수 있어요
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-56px)] w-full">
      <Map
        centers={MOCK_CENTER_LIST}
        onCenterClick={(center: Center) => router.push(`/centers/${center.id}`)}
      />
    </div>
  );
}
