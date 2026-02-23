'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { InfoItem } from '@/components/InfoItem';
import { MenuListItem } from '@/components/MenuListItem';
import { centerApi, CenterItem } from '@/lib/api/center';
import { authApi, MeResponse } from '@/lib/api/auth';
import { formatPhoneNumber } from '@/lib/utils/format';
import markerPin from '@/assets/images/marker-pin.svg';
import phoneIcon from '@/assets/images/phone.svg';

export default function SellerMyPage() {
  const pathname = usePathname();
  const [center, setCenter] = useState<CenterItem | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // User 정보와 Center 정보를 병렬로 가져오기
      const [userData, centerData] = await Promise.all([authApi.me(), centerApi.getMyCenter()]);
      setUser(userData);
      setCenter(centerData);
    } catch (error) {
      console.error('정보를 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // pathname 변경 시 데이터 새로고침 (프로필 수정 후 돌아왔을 때)
  useEffect(() => {
    if (pathname === '/seller/mypage') {
      setLoading(true);
      fetchData();
    }
  }, [pathname]);

  // 페이지 포커스 시 데이터 새로고침 (다른 탭에서 돌아왔을 때)
  useEffect(() => {
    const handleFocus = () => {
      if (pathname === '/seller/mypage') {
        fetchData();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [pathname]);

  if (loading) return <div className="p-10 text-center">정보를 불러오는 중입니다...</div>;
  if (!center) return <div className="p-10 text-center">등록된 센터 정보가 없습니다.</div>;
  if (!user) return <div className="p-10 text-center">사용자 정보를 불러올 수 없습니다.</div>;

  const centerData = {
    name: center.name,
    ownerName: user.nickname,
    address: `${center.address1} ${center.address2 || ''}`,
    // User의 phone과 profileImage 사용 (전화번호 포맷팅 적용)
    phone: user.phone ? formatPhoneNumber(user.phone) : '연락처 미등록',
    introduction: center.introduction || '등록된 소개글이 없습니다.',
    // API 응답에서 profileImgUrl 또는 profileImage 사용
    profileImgUrl: user.profileImgUrl || user.profileImage || null,
  };

  const menuItems = [
    { title: '회원 정보 수정', href: '/seller/profile/edit' },
    { title: '클래스 관리', href: '/seller/classes' },
    { title: '정산', href: '/seller/sales' },
    { title: '쿠폰 관리', href: '/seller/coupons' },
  ];

  return (
    <div className="-mx-4 flex min-h-screen flex-col md:-mx-8">
      {/* 1. 프로필 섹션 */}
      <div className="w-full bg-white px-5 py-8">
        <div className="flex w-full items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-gray-100 shadow-sm">
            {centerData.profileImgUrl ? (
              <Image
                key={centerData.profileImgUrl} // key를 추가하여 이미지 변경 시 강제 리렌더링
                src={`${centerData.profileImgUrl}?t=${Date.now()}`}
                alt={centerData.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <span className="text-xs font-medium text-gray-400">No Image</span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg leading-7 font-bold text-gray-800">{centerData.name}</p>
            <p className="text-sm leading-5 font-medium text-gray-500">{centerData.ownerName}</p>
          </div>
        </div>
      </div>

      <div className="h-3 w-full bg-gray-50" />

      {/* 2. 센터 정보 섹션 */}
      <div className="w-full bg-white p-5">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-6">
            <InfoItem icon={markerPin} label="주소" value={centerData.address} alt="주소 아이콘" />
            <InfoItem icon={phoneIcon} label="연락처" value={centerData.phone} alt="전화 아이콘" />
          </div>
          <div className="flex w-full items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="flex-1 text-sm leading-6 font-normal whitespace-pre-wrap text-gray-600">
              {centerData.introduction}
            </p>
          </div>
        </div>
      </div>

      <div className="h-3 w-full bg-gray-50" />

      {/* 3. 메뉴 섹션 */}
      <div className="flex w-full flex-1 flex-col gap-2 bg-white p-5 pb-10">
        <p className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">메뉴</p>
        <div className="flex w-full flex-col">
          {menuItems.map((item, index) => (
            <MenuListItem
              key={index}
              title={item.title}
              href={item.href}
              isLast={index === menuItems.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
