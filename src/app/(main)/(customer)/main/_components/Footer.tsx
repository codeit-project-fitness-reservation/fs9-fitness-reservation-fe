'use client';

import Image from 'next/image';
import FitmatchLogo from '@/assets/images/FITMATCH.svg';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-100 py-8 md:px-14">
      <div className="mx-auto flex w-full flex-col gap-8 md:max-w-240 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4">
          <Image
            src={FitmatchLogo}
            alt="FITMATCH"
            width={120}
            height={32}
            className="max-[640px]:w-24"
          />
          <div className="flex flex-col gap-1 text-sm text-gray-600 max-[640px]:text-xs">
            <p>(주)FITMATH</p>
            <p>대표: 이정윤 | 사업자등록번호: 123-456-78910</p>
            <p>주소: 청계천로 100 시그니쳐타워, 10층 동관, 중구 서울특별시</p>
            <p className="mt-2">©2026 FITMATCH</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 max-[640px]:gap-1 md:items-end">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 max-[640px]:text-xs"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            사업자 정보
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 max-[640px]:text-xs"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            고객센터
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 max-[640px]:text-xs"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            서비스 이용약관
          </a>
        </div>
      </div>
    </footer>
  );
}
