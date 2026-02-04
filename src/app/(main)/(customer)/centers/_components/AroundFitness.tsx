/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_CENTER_LIST } from '@/mocks/centers';
import type { Center } from '@/types';

const NEARBY_RADIUS_KM = 8;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dLng / 2) * Math.sin(dLng / 2));

  return 2 * R * Math.asin(Math.sqrt(h));
}

type AroundFitnessProps = {
  ensureMapReady: () => any | null;
  isKakaoLoaded: boolean;
  currentCoords: { lat: number; lng: number } | null;
  pinnedCenterId?: string | null;
};

export default function AroundFitness({
  ensureMapReady,
  isKakaoLoaded,
  currentCoords,
  pinnedCenterId,
}: AroundFitnessProps) {
  const router = useRouter();

  const centersInfoWindowRef = useRef<any>(null);
  const centerMarkersRef = useRef<globalThis.Map<string, any>>(new globalThis.Map());
  const selectedCenterIdRef = useRef<string | null>(null);

  const getNearbyCenters = useCallback(
    (coords: { lat: number; lng: number } | null, pinned?: string | null) => {
      const list = MOCK_CENTER_LIST.filter(
        (c) => typeof c.lat === 'number' && typeof c.lng === 'number',
      );
      const pinnedCenter = pinned ? list.find((c) => c.id === pinned) : undefined;

      if (!coords) {
        if (pinnedCenter && !list.some((c) => c.id === pinnedCenter.id))
          return [pinnedCenter, ...list];
        return list;
      }

      const nearby = list.filter((c) => {
        const d = haversineKm(coords, { lat: c.lat as number, lng: c.lng as number });
        return d <= NEARBY_RADIUS_KM;
      });

      const base = nearby.length > 0 ? nearby : list;
      if (pinnedCenter && !base.some((c) => c.id === pinnedCenter.id))
        return [pinnedCenter, ...base];
      return base;
    },
    [],
  );

  const ensureCenterMarkers = useCallback(
    (centers: Center[]) => {
      const map = ensureMapReady();
      if (!map) return;
      if (!window.kakao?.maps) return;

      if (!centersInfoWindowRef.current) {
        centersInfoWindowRef.current = new window.kakao.maps.InfoWindow({ removable: false });
      }

      // sprite marker images (샘플 기반)
      const markerSize = new window.kakao.maps.Size(33, 36);
      const overMarkerSize = new window.kakao.maps.Size(40, 42);
      const markerOffset = new window.kakao.maps.Point(12, 36);
      const overMarkerOffset = new window.kakao.maps.Point(13, 42);
      const spriteImageSize = new window.kakao.maps.Size(126, 146);
      const SPRITE_MARKER_URL =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png';

      const createMarkerImage = (size: any, offset: any, spriteOrigin: any) =>
        new window.kakao.maps.MarkerImage(SPRITE_MARKER_URL, size, {
          offset,
          spriteOrigin,
          spriteSize: spriteImageSize,
        });

      const normalImage = createMarkerImage(
        markerSize,
        markerOffset,
        new window.kakao.maps.Point(0, 0),
      );
      const overImage = createMarkerImage(
        overMarkerSize,
        overMarkerOffset,
        new window.kakao.maps.Point(43, 0),
      );
      const clickImage = createMarkerImage(
        markerSize,
        markerOffset,
        new window.kakao.maps.Point(86, 0),
      );

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

    const centers = getNearbyCenters(currentCoords, pinnedCenterId);
    ensureCenterMarkers(centers);
  }, [currentCoords, ensureCenterMarkers, getNearbyCenters, isKakaoLoaded, pinnedCenterId]);

  useEffect(() => {
    if (!pinnedCenterId) return;
    if (!isKakaoLoaded) return;
    if (!window.kakao?.maps) return;

    const centers = getNearbyCenters(currentCoords, pinnedCenterId);
    ensureCenterMarkers(centers);
    focusCenterById(pinnedCenterId);
  }, [
    currentCoords,
    ensureCenterMarkers,
    focusCenterById,
    getNearbyCenters,
    isKakaoLoaded,
    pinnedCenterId,
  ]);

  return null;
}
