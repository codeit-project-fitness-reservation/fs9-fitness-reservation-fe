'use client';

import { useState } from 'react';
import { MOCK_USERS } from '@/_mock/user';
import AdminFilter, { userFilterConfigs, FilterValues } from '../_components/AdminFilter';
import UserList from './_components/UserList';

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">회원 관리</h1>
      <AdminFilter
        configs={userFilterConfigs}
        onFilterChange={handleFilterChange}
        initialValues={filters}
      />
      <UserList users={filteredUsers} />
    </div>
  );
}
