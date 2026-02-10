'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Class } from '@/types/class';
import { Center } from '@/types';
import mapPinIcon from '@/assets/images/map-pin.svg';

interface ClassInfoProps {
  classData: Class;
  centerData: Center;
}

export default function ClassInfo({ classData, centerData }: ClassInfoProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      {/* 클래스 제목 */}
      <h1 className="text-2xl font-bold text-gray-900 max-[768px]:text-xl">{classData.title}</h1>

      {/* 위치 정보 */}
      <div className="flex items-start gap-2">
        <Image src={mapPinIcon} alt="위치" width={20} height={20} className="mt-0.5 shrink-0" />
        <p className="text-sm text-gray-700 md:text-base">
          <button
            type="button"
            onClick={() => router.push(`/centers?centerId=${centerData.id}`)}
            className="hover:text-black-600 font-medium underline underline-offset-2"
          >
            {centerData.name}
          </button>{' '}
          {centerData.address1} {centerData.address2 || ''}
        </p>
      </div>

      {/* 가격 */}
      <p className="text-xl font-semibold text-gray-900">
        {classData.pricePoints.toLocaleString()}원
      </p>
    </div>
  );
}
