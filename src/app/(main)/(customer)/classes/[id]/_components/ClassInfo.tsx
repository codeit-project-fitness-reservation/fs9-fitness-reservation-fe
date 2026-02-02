import Image from 'next/image';
import { Class } from '@/types/class';
import { Center } from '@/types';
import mapPinIcon from '@/assets/images/map-pin.svg';
import userIcon from '@/assets/images/user-02.svg';

interface ClassInfoProps {
  classData: Class;
  centerData: Center;
}

export default function ClassInfo({ classData, centerData }: ClassInfoProps) {
  return (
    <>
      {/* 클래스 제목 */}
      <h1 className="text-2xl font-bold text-gray-900 max-[768px]:text-xl">{classData.title}</h1>

      {/* 위치 정보 */}
      <div className="flex items-start gap-2">
        <Image src={mapPinIcon} alt="위치" width={20} height={20} className="mt-0.5 shrink-0" />
        <p className="text-base text-gray-700">
          {centerData.name} {centerData.address1} {centerData.address2 || ''}
        </p>
      </div>

      {/* 참가자 수 및 가격 */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Image src={userIcon} alt="참가자" width={20} height={20} />
          <p className="text-base text-gray-700">{classData.capacity}명</p>
        </div>
        <p className="text-xl font-semibold text-gray-900">
          {classData.pricePoints.toLocaleString()}원
        </p>
      </div>
    </>
  );
}
