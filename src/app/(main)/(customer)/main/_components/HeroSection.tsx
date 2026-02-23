'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RoleSwitcher from '@/app/(main)/_components/RoleSwitcher';
import SearchBar from '@/app/(main)/(customer)/classes/_components/SearchBar';
import HeroBg from '@/assets/images/hero.svg';

type Role = 'customer' | 'seller';

interface HeroSectionProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function HeroSection({ activeRole, onRoleChange }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/classes?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/classes');
    }
  };

  // 판매자 뷰일 때는 HeroSection을 숨김
  if (activeRole === 'seller') {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 md:py-24">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image src={HeroBg} alt="" fill className="object-cover object-center" priority />
      </div>

      <div className="relative z-10 mx-auto flex w-full flex-col items-center gap-6 px-4 md:max-w-240">
        <div className="mb-6">
          <RoleSwitcher activeRole={activeRole} onRoleChange={onRoleChange} />
        </div>
        <h1 className="text-center text-3xl font-bold text-gray-900 max-[640px]:text-2xl">
          지금 바로 하고 싶은 클래스를 찾아보세요
        </h1>
        <p className="text-center text-base text-gray-600 max-[640px]:text-sm">
          취향에 따라서 원하는 모임을 골라보세요.
        </p>
        <div className="w-full max-w-2xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="검색어를 입력해주세요."
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
