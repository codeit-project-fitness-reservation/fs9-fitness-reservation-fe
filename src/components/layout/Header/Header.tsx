'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BaseButton } from '@/components/common/BaseButton';
import { NotificationDropdown } from './NotificationDropdown';
import { MOCK_NOTIFICATIONS } from '@/mocks/mockdata';
import { NotificationItem } from '@/types';
import { authFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import icBell from '@/assets/images/bell.svg';
import icChevronDown from '@/assets/images/chevron-down.svg';
import logoImg from '@/assets/images/FITMATCH.svg';

type ServerNotification = {
  id: string;
  userId: string;
  title: string;
  body: string | null;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
};

const Header = () => {
  const pathname = usePathname();

  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const sseRef = useRef<EventSource | null>(null);

  const handleReadAll = () => {
    const unread = notifications.filter((n) => !n.isRead);
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    unread.forEach((n) => {
      void authFetch(`/api/notifications/${n.id}`, {
        method: 'PATCH',
        body: { isRead: true },
      });
    });
  };

  const handleReadOne = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    void authFetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      body: { isRead: true },
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    void authFetch(`/api/notifications/${id}`, { method: 'DELETE' });
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
    // 기존 SSE 연결 정리
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }

    if (!user) return;

    let mounted = true;

    const loadInitial = async () => {
      const result = await authFetch<{
        items: ServerNotification[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }>('/api/notifications?page=1&limit=20');

      if (!mounted) return;

      if (result.ok) {
        setNotifications(
          result.data.items.map((n) => ({
            id: n.id,
            userId: n.userId,
            title: n.title,
            body: n.body ?? undefined,
            linkUrl: n.linkUrl ?? undefined,
            isRead: n.isRead,
            createdAt:
              typeof n.createdAt === 'string' ? n.createdAt : new Date(n.createdAt).toISOString(),
          })),
        );
      }
    };

    void loadInitial();

    const es = new EventSource('/api/notifications/stream');
    sseRef.current = es;

    const onCreated = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as ServerNotification;
      setNotifications((prev) => [
        {
          id: payload.id,
          userId: payload.userId,
          title: payload.title,
          body: payload.body ?? undefined,
          linkUrl: payload.linkUrl ?? undefined,
          isRead: false,
          createdAt:
            typeof payload.createdAt === 'string'
              ? payload.createdAt
              : new Date(payload.createdAt).toISOString(),
        },
        ...prev,
      ]);
    };

    const onUpdated = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as ServerNotification;
      // 읽음 처리된 알림은 목록에서 제거
      if (payload.isRead) {
        setNotifications((prev) => prev.filter((n) => n.id !== payload.id));
        return;
      }
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === payload.id
            ? {
                ...n,
                title: payload.title,
                body: payload.body ?? undefined,
                linkUrl: payload.linkUrl ?? undefined,
                isRead: payload.isRead,
              }
            : n,
        ),
      );
    };

    const onDeleted = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as { id: string };
      setNotifications((prev) => prev.filter((n) => n.id !== payload.id));
    };

    es.addEventListener('notification.created', onCreated as unknown as EventListener);
    es.addEventListener('notification.updated', onUpdated as unknown as EventListener);
    es.addEventListener('notification.deleted', onDeleted as unknown as EventListener);

    es.onerror = () => {
      // EventSource는 기본적으로 자동 재연결합니다.
    };

    return () => {
      mounted = false;
      es.removeEventListener('notification.created', onCreated as unknown as EventListener);
      es.removeEventListener('notification.updated', onUpdated as unknown as EventListener);
      es.removeEventListener('notification.deleted', onDeleted as unknown as EventListener);
      es.close();
      if (sseRef.current === es) sseRef.current = null;
    };
  }, [user]);

  if (pathname.startsWith('/admin')) return null;
  const logoHref = pathname.startsWith('/seller') ? '/seller' : user ? '/main' : '/';
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
                  {user.nickname ?? '회원'}님
                  <Image
                    src={icChevronDown}
                    alt=""
                    width={12}
                    height={12}
                    className={`transition-transform ${isProfileOpen}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-32 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <Link
                      href={user.role === 'SELLER' ? '/seller/mypage' : '/my'}
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-right text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
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
