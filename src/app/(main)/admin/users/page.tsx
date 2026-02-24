'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminFilter, { userFilterConfigs, FilterValues } from '../_components/AdminFilter';
import UserList from './_components/UserList';
import UserStats from './_components/UserStats';
import UserDetailModal from './_components/UserDetailModal';
import { userApi } from '@/lib/api/user';
import { User } from '@/types';
import Pagination from '@/components/Pagination';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    customer: 0,
    seller: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10;

  const [filters, setFilters] = useState<FilterValues>({
    role: '전체',
    searchType: 'nickname',
    search: '',
  });

  const fetchStats = async () => {
    try {
      const response = await userApi.getStats();
      if (response) {
        setStats(response);
      }
    } catch (error) {
      console.error('통계 조회 실패:', error);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const roleFilter = filters.role !== '전체' ? filters.role : undefined;
      const searchTypeFilter = filters.searchType as 'nickname' | 'email' | 'phone' | undefined;

      const response = await userApi.getUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        role: roleFilter,
        searchType: searchTypeFilter,
        search: filters.search,
      });

      if (response) {
        setUsers(response.users);
        setTotalCount(response.totalCount);
        // API 응답에 stats가 포함되어 있다면 여기서 업데이트해도 됨
        // setStats(response.stats);
      }
    } catch (error) {
      console.error('회원 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="text-gray-500">회원 목록을 조회하고 관리할 수 있습니다.</p>
      </div>

      <UserStats stats={stats} />

      <div className="flex flex-col gap-4">
        <AdminFilter
          configs={userFilterConfigs}
          onFilterChange={handleFilterChange}
          initialValues={filters}
        />
        <UserList users={users} loading={loading} onUserClick={setSelectedUserId} />

        {users.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {selectedUserId && (
        <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}
