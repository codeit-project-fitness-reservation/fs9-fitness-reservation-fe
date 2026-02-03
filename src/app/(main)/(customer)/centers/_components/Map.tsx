'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Center } from '@/types';

declare global {
  interface Window {
    kakao: unknown;
  }
}

type KakaoMap = {
  setBounds: (bounds: unknown) => void;
};

type KakaoMarker = {
  getPosition: () => unknown;
};

type KakaoMaps = {
  load: (callback: () => void) => void;
  Map: new (container: HTMLElement, options: { center: unknown; level: number }) => KakaoMap;
  LatLng: new (lat: number, lng: number) => unknown;
  LatLngBounds: new () => { extend: (latlng: unknown) => void };
  Marker: new (options: { map: KakaoMap; position: unknown }) => KakaoMarker;
  event: {
    addListener: (target: unknown, type: string, handler: () => void) => void;
  };
};

type KakaoGlobal = {
  maps: KakaoMaps;
};

type Props = {
  centers: Center[];
  onCenterClick?: (center: Center) => void;
};

export default function Map({ centers, onCenterClick }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<KakaoMap | null>(null);

  // 1) 카카오맵 SDK 로드 완료
  const handleLoad = () => {
    const kakao = window.kakao as KakaoGlobal;
    kakao.maps.load(() => setIsLoaded(true));
  };

  // 2) 지도 생성 (최초 1회)
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const kakao = window.kakao as KakaoGlobal;
    const kakaoMap = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.5012, 127.0396), // 강남
      level: 5,
    });

    setMap(kakaoMap);
  }, [isLoaded]);

  // 3) 센터 마커 찍기
  useEffect(() => {
    if (!map) return;

    const kakao = window.kakao as KakaoGlobal;
    const bounds = new kakao.maps.LatLngBounds();

    centers.forEach((center) => {
      if (!center.lat || !center.lng) return;

      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(center.lat, center.lng),
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        onCenterClick?.(center);
      });

      bounds.extend(marker.getPosition());
    });

    if (centers.length > 0) {
      map.setBounds(bounds);
    }
  }, [map, centers, onCenterClick]);

  if (!apiKey) return null;

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={handleLoad}
      />
      <div ref={mapRef} className="h-full w-full" />
    </>
  );
}
