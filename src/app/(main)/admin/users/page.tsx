'use client';

import { useState } from 'react';
import { MOCK_USERS } from '@/_mock/user';
import AdminFilter, { userFilterConfigs, FilterValues } from '../_components/AdminFilter';
import UserList from './_components/UserList';
import UserStats from './_components/UserStats';

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<FilterValues>({
    role: '전체',
    searchType: 'nickname',
    search: '',
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const filteredUsers = MOCK_USERS.filter((user) => {
    if (filters.role && filters.role !== '전체') {
      if (user.role !== filters.role) return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchType = filters.searchType || 'nickname';

      if (searchType === 'nickname') {
        return user.nickname.toLowerCase().includes(searchLower);
      }
      if (searchType === 'email') {
        return user.email.toLowerCase().includes(searchLower);
      }
      if (searchType === 'phone') {
        return user.phone.includes(searchLower);
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="text-gray-500">회원 목록을 조회하고 관리할 수 있습니다.</p>
      </div>

      <UserStats users={MOCK_USERS} />

      <div className="flex flex-col gap-4">
        <AdminFilter
          configs={userFilterConfigs}
          onFilterChange={handleFilterChange}
          initialValues={filters}
        />
        <UserList users={filteredUsers} />
      </div>
    </div>
  );
}
