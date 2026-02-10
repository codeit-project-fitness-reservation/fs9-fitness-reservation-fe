//마이페이지 메뉴 부분
import Image from 'next/image';
import Link from 'next/link';
import chevronRight from '@/assets/images/chevron-right.svg';

interface MenuListItemProps {
  title: string;
  href: string;
  isLast?: boolean;
}

export const MenuListItem = ({ title, href, isLast = false }: MenuListItemProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between bg-white py-4 ${
        isLast ? '' : 'border-b border-gray-200'
      }`}
    >
      <p className="text-base font-semibold text-gray-800">{title}</p>
      <div className="h-4 w-4 overflow-hidden">
        <Image src={chevronRight} alt="" width={16} height={16} className="text-gray-800" />
      </div>
    </Link>
  );
};
