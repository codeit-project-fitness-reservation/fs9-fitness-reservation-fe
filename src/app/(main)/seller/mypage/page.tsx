import Image from 'next/image';
import { InfoItem } from '@/components/InfoItem';
import { MenuListItem } from '@/components/MenuListItem';
import { MOCK_ACCOUNTS, MOCK_SELLER_CENTER } from '@/mocks/mockdata';
import markerPin from '@/assets/images/marker-pin.svg';
import phone from '@/assets/images/phone.svg';

export default function SellerMyPage() {
  const seller = MOCK_ACCOUNTS['seller@test.com'];
  const center = MOCK_SELLER_CENTER;

  const centerData = {
    name: center.name,
    ownerName: seller.nickname,
    address: `${center.address1}${center.address2 ? ' ' + center.address2 : ''}`,
    phone: seller.phone,
    introduction: center.introduction || '항상 최선을 다하는 피트니스 센터입니다.',
    profileImgUrl:
      center.profileImgUrl ||
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80',
  };

  const menuItems = [
    { title: '회원 정보 수정', href: '/seller/profile/edit' },
    { title: '클래스 관리', href: '/seller/classes' },

    { title: '정산', href: '/seller/settlement' },
  ];

  return (
    <div className="-mx-4 flex min-h-screen flex-col md:-mx-8">
      {/* 1. 프로필 섹션 */}
      <div className="w-full bg-white px-5 py-8">
        <div className="flex w-full items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gray-100">
            <Image
              src={centerData.profileImgUrl}
              alt={centerData.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg leading-7 font-bold text-gray-800">{centerData.name}</p>
            <p className="text-sm leading-5 font-medium text-gray-500">{centerData.ownerName}</p>
          </div>
        </div>
      </div>

      {/* 섹션 구분 */}
      <div className="h-3 w-full bg-gray-50" />

      {/* 2. 센터 정보 섹션 */}
      <div className="w-full bg-white p-5">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <InfoItem
                icon={markerPin}
                label="주소"
                value={centerData.address}
                alt="주소 아이콘"
              />
            </div>
            <div className="flex-1">
              <InfoItem icon={phone} label="연락처" value={centerData.phone} alt="전화 아이콘" />
            </div>
          </div>
          <div className="flex w-full items-center justify-center rounded-xl bg-gray-100 p-4">
            <p className="flex-1 text-sm leading-5 font-normal whitespace-pre-wrap text-gray-700">
              {centerData.introduction}
            </p>
          </div>
        </div>
      </div>

      <div className="h-3 w-full bg-gray-50" />

      {/* 3. 메뉴 섹션 */}
      <div className="flex w-full flex-1 flex-col gap-2 bg-white p-5">
        <p className="text-sm leading-5 font-semibold text-gray-400">메뉴</p>
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
