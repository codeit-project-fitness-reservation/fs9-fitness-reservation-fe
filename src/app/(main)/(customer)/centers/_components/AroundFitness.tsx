/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_CENTER_LIST } from '@/mocks/centers';
import type { Center } from '@/types';
import markerSvg from '@/assets/images/marker.svg';

type AroundFitnessProps = {
  ensureMapReady: () => any | null;
  isKakaoLoaded: boolean;
  pinnedCenterId?: string | null;
};

export default function AroundFitness({
  ensureMapReady,
  isKakaoLoaded,
  pinnedCenterId,
}: AroundFitnessProps) {
  const router = useRouter();

  const centersInfoWindowRef = useRef<any>(null);
  const centerMarkersRef = useRef<globalThis.Map<string, any>>(new globalThis.Map());
  const selectedCenterIdRef = useRef<string | null>(null);

  const ensureCenterMarkers = useCallback(
    (centers: Center[]) => {
      const map = ensureMapReady();
      if (!map) return;
      if (!window.kakao?.maps) return;

      if (!centersInfoWindowRef.current) {
        centersInfoWindowRef.current = new window.kakao.maps.InfoWindow({ removable: false });
      }

      // marker image
      const markerSize = new window.kakao.maps.Size(30, 30);
      const overMarkerSize = new window.kakao.maps.Size(36, 36);
      const markerOffset = new window.kakao.maps.Point(15, 30);
      const overMarkerOffset = new window.kakao.maps.Point(18, 36);
      const MARKER_URL = markerSvg.src || markerSvg;

      const normalImage = new window.kakao.maps.MarkerImage(MARKER_URL, markerSize, {
        offset: markerOffset,
      });
      const overImage = new window.kakao.maps.MarkerImage(MARKER_URL, overMarkerSize, {
        offset: overMarkerOffset,
      });
      const clickImage = new window.kakao.maps.MarkerImage(MARKER_URL, markerSize, {
        offset: markerOffset,
      });

      const nextIds = new Set(centers.map((c) => c.id));

      for (const [id, entry] of centerMarkersRef.current.entries()) {
        if (!nextIds.has(id)) {
          entry.marker.setMap(null);
          centerMarkersRef.current.delete(id);
        }
      }

      for (const center of centers) {
        if (centerMarkersRef.current.has(center.id)) continue;
        if (typeof center.lat !== 'number' || typeof center.lng !== 'number') continue;

        const position = new window.kakao.maps.LatLng(center.lat, center.lng);
        const marker = new window.kakao.maps.Marker({
          map,
          position,
          image: normalImage,
        });

        marker.normalImage = normalImage;

        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          if (selectedCenterIdRef.current !== center.id) marker.setImage(overImage);
          centersInfoWindowRef.current?.setContent(
            `<div style="padding:6px 8px;">${center.name}</div>`,
          );
          centersInfoWindowRef.current?.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          if (selectedCenterIdRef.current !== center.id) marker.setImage(normalImage);
          centersInfoWindowRef.current?.close();
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          router.push(`/centers/${center.id}`);
        });

        centerMarkersRef.current.set(center.id, {
          marker,
          normalImage,
          overImage,
          clickImage,
          center,
        });
      }
    },
    [ensureMapReady, router],
  );

  const focusCenterById = useCallback(
    (centerId: string) => {
      const entry = centerMarkersRef.current.get(centerId);
      const map = ensureMapReady();
      if (!entry || !map) return;

      if (selectedCenterIdRef.current && selectedCenterIdRef.current !== centerId) {
        const prev = centerMarkersRef.current.get(selectedCenterIdRef.current);
        if (prev) prev.marker.setImage(prev.normalImage);
      }

      selectedCenterIdRef.current = centerId;
      entry.marker.setImage(entry.clickImage);
      centersInfoWindowRef.current?.setContent(
        `<div style="padding:6px 8px;">${entry.center.name}</div>`,
      );
      centersInfoWindowRef.current?.open(map, entry.marker);
      map.panTo(entry.marker.getPosition());
    },
    [ensureMapReady],
  );

  useEffect(() => {
    if (!isKakaoLoaded) return;
    if (!window.kakao?.maps) return;

    const centers = MOCK_CENTER_LIST.filter(
      (c) => typeof c.lat === 'number' && typeof c.lng === 'number',
    );
    ensureCenterMarkers(centers);
  }, [ensureCenterMarkers, isKakaoLoaded]);

  useEffect(() => {
    if (!pinnedCenterId) return;
    if (!isKakaoLoaded) return;
    if (!window.kakao?.maps) return;

    const centers = MOCK_CENTER_LIST.filter(
      (c) => typeof c.lat === 'number' && typeof c.lng === 'number',
    );
    ensureCenterMarkers(centers);
    focusCenterById(pinnedCenterId);
  }, [ensureCenterMarkers, focusCenterById, isKakaoLoaded, pinnedCenterId]);

  return null;
}
