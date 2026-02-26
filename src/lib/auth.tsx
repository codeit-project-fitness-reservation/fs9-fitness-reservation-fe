'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { authFetch } from '@/lib/api';
import type { UserRole } from '@/types';

export type AuthUser = {
  id: string;
  role: UserRole;
  nickname?: string;
};

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setUser = useCallback((nextUser: AuthUser | null) => {
    setUserState(nextUser);
    setError(null);
    setStatus(nextUser ? 'authenticated' : 'unauthenticated');
  }, []);

  const refresh = useCallback(async () => {
    setError(null);

    const result = await authFetch<{ id: string; role: UserRole; nickname?: string }>(
      '/api/auth/me',
      { headers: { 'Cache-Control': 'no-cache' } },
    );
    if (!result.ok) {
      setUserState(null);
      setStatus('unauthenticated');
      setError(result.error);
      return;
    }

    setUserState({
      id: result.data.id,
      role: result.data.role,
      nickname: result.data.nickname,
    });
    setStatus('authenticated');
  }, []);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    void refresh();
    // refresh는 useCallback으로 안정적이므로 의존성 배열에서 제외해도 무방
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      // API 성공/실패와 관계없이 클라이언트 상태는 항상 로그아웃 처리
      setUserState(null);
      setStatus('unauthenticated');
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      status,
      user,
      error,
      isAuthenticated: status === 'authenticated',
      refresh,
      setUser,
      logout,
    };
  }, [error, refresh, logout, setUser, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
