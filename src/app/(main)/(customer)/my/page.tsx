'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MenuListItem } from '@/components/MenuListItem';
import { BaseButton } from '@/components/common/BaseButton';
import { MOCK_ACCOUNTS } from '@/mocks/mockdata';

import coinsIcon from '@/assets/images/coins.svg';
import myfotoIcon from '@/assets/images/myfoto.svg';
import ticketIcon from '@/assets/images/ticket.svg';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

interface UserInfo {
  id: string;
  nickname: string;
  couponCount: number;
  pointBalance: number;
}

export default function MyPage() {
  const router = useRouter();

  const mockUser = MOCK_ACCOUNTS['user@test.com'];
  const userInfo: UserInfo = {
    id: mockUser.id,
    nickname: mockUser.nickname,
    couponCount: mockUser.couponCount,
    pointBalance: mockUser.pointBalance,
  };

  const menuItems = [
    { title: '회원 정보 수정', href: '/my/edit' },
    { title: '내 예약', href: '/my/reservations' },
    { title: '수강 내역', href: '/my/history' },
    { title: '포인트 내역', href: '/my/points' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start gap-8 bg-white px-4 py-10 md:px-0 md:py-10">
      <section className="flex w-full flex-col items-center gap-4 self-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={getSvgSrc(myfotoIcon as SvgImport)}
            alt="프로필"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{userInfo.nickname}님</h2>
      </section>

      <div className="h-3 w-full bg-gray-100" />

      <section className="flex w-full flex-col gap-4 md:flex-row">
        <div className="flex flex-1 items-center gap-4 bg-white p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Image src={getSvgSrc(ticketIcon as SvgImport)} alt="쿠폰" width={24} height={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">쿠폰</p>
            <p className="text-lg font-bold text-blue-600">{userInfo.couponCount}장</p>
          </div>
          <BaseButton
            variant="secondary"
            className="shrink-0 rounded-md"
            onClick={() => router.push('/my/coupons')}
          >
            쿠폰함
          </BaseButton>
        </div>

        <div className="flex flex-1 items-center gap-4 bg-white p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Image src={getSvgSrc(coinsIcon as SvgImport)} alt="포인트" width={24} height={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">포인트</p>
            <p className="text-lg font-bold text-blue-600">
              {userInfo.pointBalance.toLocaleString()}P
            </p>
          </div>
          <BaseButton
            variant="secondary"
            className="shrink-0 rounded-md"
            onClick={() => router.push('/point-charge')}
          >
            충전하기
          </BaseButton>
        </div>
      </section>

      <div className="h-3 w-full bg-gray-100" />
      <section className="flex flex-1 flex-col items-start gap-4 self-stretch bg-white md:px-12">
        <h3 className="text-base font-semibold text-gray-400">메뉴</h3>
        <div className="flex w-full flex-col gap-4">
          {menuItems.map((item, index) => (
            <MenuListItem
              key={item.href}
              title={item.title}
              href={item.href}
              isLast={index === menuItems.length - 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
