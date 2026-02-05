/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import CurrentLocationButton from './CurrentLocationButton';
import AroundFitness from './AroundFitness';

declare global {
  interface Window {
    kakao: any;
  }
}

const DEFAULT_CENTER = { lat: 37.499312, lng: 127.036046 };

export default function KakaoMap() {
  const searchParams = useSearchParams();
  const centerIdFromQuery = searchParams.get('centerId');

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const currentLocationInfoWindowRef = useRef<any>(null);
  const hasAutoLocatedRef = useRef(false);
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  const [isKakaoScriptLoaded, setIsKakaoScriptLoaded] = useState(false);
  const [isKakaoMapsReady, setIsKakaoMapsReady] = useState(false);

  const ensureMapReady = useCallback(() => {
    if (!mapRef.current) return null;
    if (!isKakaoMapsReady) return null;
    if (!window.kakao?.maps) return null;
    if (mapInstanceRef.current) return mapInstanceRef.current;

    const options = {
      center: new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
      level: 5,
    };

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
    return mapInstanceRef.current;
  }, [isKakaoMapsReady]);

  const displayCurrentLocation = useCallback(
    (locPosition: any, message: string) => {
      const map = ensureMapReady();
      if (!map) return;

      if (!currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current = new window.kakao.maps.Marker({
          map,
          position: locPosition,
        });
      } else {
        currentLocationMarkerRef.current.setMap(map);
        currentLocationMarkerRef.current.setPosition(locPosition);
      }

      if (!currentLocationInfoWindowRef.current) {
        currentLocationInfoWindowRef.current = new window.kakao.maps.InfoWindow({
          removable: true,
        });
      }

      currentLocationInfoWindowRef.current.setContent(message);
      currentLocationInfoWindowRef.current.open(map, currentLocationMarkerRef.current);
      map.setCenter(locPosition);
    },
    [ensureMapReady],
  );

  const moveToCurrentLocation = useCallback(() => {
    if (!window.kakao?.maps) return;

    if (!navigator.geolocation) {
      const fallbackPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);
      displayCurrentLocation(
        fallbackPosition,
        '<div style="padding:5px;">geolocation을 사용할수 없어요..</div>',
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const locPosition = new window.kakao.maps.LatLng(lat, lon);
        const message = '<div style="padding:5px;">여기에 계신가요?!</div>';
        displayCurrentLocation(locPosition, message);
      },
      () => {
        const fallbackPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);
        displayCurrentLocation(
          fallbackPosition,
          '<div style="padding:5px;">현재 위치를 가져올 수 없어요..</div>',
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }, [displayCurrentLocation]);

  useEffect(() => {
    if (!isKakaoScriptLoaded) return;
    if (!window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      setIsKakaoMapsReady(true);
      ensureMapReady();
      if (!hasAutoLocatedRef.current) {
        hasAutoLocatedRef.current = true;
        if (!centerIdFromQuery) moveToCurrentLocation();
      }
    });
  }, [centerIdFromQuery, ensureMapReady, isKakaoScriptLoaded, moveToCurrentLocation]);

  if (!apiKey) return null;

  return (
    <div className="relative h-full w-full">
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setIsKakaoScriptLoaded(true)}
      />
      <CurrentLocationButton onClick={moveToCurrentLocation} />
      <AroundFitness
        ensureMapReady={ensureMapReady}
        isKakaoLoaded={isKakaoMapsReady}
        pinnedCenterId={centerIdFromQuery}
      />
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
