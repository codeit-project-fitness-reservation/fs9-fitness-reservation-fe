'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BaseButton } from '@/components/common/BaseButton';
import { NotificationDropdown } from './NotificationDropdown';
import { MOCK_NOTIFICATIONS } from '@/mocks/mockdata';
import { UserRole, NotificationItem } from '@/types';
import icBell from '@/assets/images/bell.svg';
import icChevronDown from '@/assets/images/chevron-down.svg';
import logoImg from '@/assets/images/FITMATCH.svg';

type HeaderUser = {
  nickname: string;
  role: UserRole;
};

const Header = () => {
  const pathname = usePathname();

  const [user, setUser] = useState<HeaderUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  const handleReadAll = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleReadOne = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotiOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const syncUserFromStorage = () => {
      const accessToken = localStorage.getItem('accessToken');
      const storedRole = (localStorage.getItem('userRole') || 'CUSTOMER') as UserRole;
      const nickname = localStorage.getItem('userNickname') || '회원';

      if (accessToken) {
        setUser({ nickname, role: storedRole });
      } else {
        setUser(null);
      }
    };

    syncUserFromStorage();
    window.addEventListener('storage', syncUserFromStorage);
    return () => window.removeEventListener('storage', syncUserFromStorage);
  }, []);

  if (pathname.startsWith('/admin')) return null;
  const logoHref = pathname.startsWith('/seller') ? '/seller' : '/';
  return (
    <header className="sticky top-0 z-50 h-14 w-full bg-gray-200">
      <div className="mx-auto flex h-full w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:max-w-240">
        <Link href={logoHref} className="flex items-center">
          <Image
            src={logoImg}
            alt="Fitmatch 로고"
            width={103}
            height={32}
            priority
            className="h-8"
          />
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotiOpen(false);
                  }}
                  className="flex items-center text-sm font-normal text-gray-700"
                >
                  {user.nickname}님
                  <Image
                    src={icChevronDown}
                    alt=""
                    width={12}
                    height={12}
                    className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-32 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <Link
                      href={user.role === 'SELLER' ? '/seller/mypage' : '/mypage'}
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-right text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('userRole');
                        localStorage.removeItem('userNickname');
                        localStorage.removeItem('userId');
                        setUser(null);
                        setIsProfileOpen(false);
                      }}
                      className="w-full border-t border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>

              <div className="relative" ref={notiRef}>
                <button
                  onClick={() => {
                    setIsNotiOpen(!isNotiOpen);
                    setIsProfileOpen(false);
                  }}
                  className="relative p-2"
                >
                  <Image src={icBell} alt="알림" width={24} height={24} />
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="right-1.7 absolute top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></span>
                  )}
                </button>
                {isNotiOpen && (
                  <NotificationDropdown
                    items={notifications}
                    onReadAll={handleReadAll}
                    onReadOne={handleReadOne}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signup">
                <BaseButton variant="secondary">회원가입</BaseButton>
              </Link>
              <Link href="/login">
                <BaseButton variant="primary">로그인</BaseButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
