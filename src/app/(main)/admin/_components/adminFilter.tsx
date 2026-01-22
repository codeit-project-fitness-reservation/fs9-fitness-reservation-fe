'use client';

import React, { useState } from 'react';

// 필터 옵션 인터페이스
export interface FilterOption {
  value: string;
  label: string;
}

// 필터 설정 인터페이스
export interface FilterConfig {
  type: 'select' | 'searchWithType';
  key: string;
  label: string;
  options?: FilterOption[];
  searchTypes?: FilterOption[];
  placeholder?: string;
  defaultValue?: string;
}

// 동적 필터 값 타입
export type FilterValues = Record<string, string>;

interface AdminFilterProps {
  configs: FilterConfig[];
  onFilterChange?: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

export default function AdminFilter({
  configs,
  onFilterChange,
  initialValues = {},
}: AdminFilterProps) {
  // 초기값 설정
  const getInitialFilters = () => {
    const initial: FilterValues = {};
    configs.forEach((config) => {
      initial[config.key] = initialValues[config.key] || config.defaultValue || '';

      // searchWithType의 경우 searchType 키도 추가
      if (config.type === 'searchWithType' && config.searchTypes) {
        const searchTypeKey = `${config.key}Type`;
        initial[searchTypeKey] = initialValues[searchTypeKey] || config.searchTypes[0]?.value || '';
      }
    });
    return initial;
  };

  const [filters, setFilters] = useState<FilterValues>(getInitialFilters());

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-row flex-nowrap items-center gap-4 overflow-x-auto">
        {configs.map((config) => {
          if (config.type === 'select') {
            return (
              <div key={config.key} className="flex shrink-0 flex-row items-center gap-2">
                <label
                  htmlFor={config.key}
                  className="text-sm font-medium whitespace-nowrap text-gray-700"
                >
                  {config.label}
                </label>
                <select
                  id={config.key}
                  value={filters[config.key] || ''}
                  onChange={(e) => handleChange(config.key, e.target.value)}
                  className="min-w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  {config.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (config.type === 'searchWithType') {
            const searchTypeKey = `${config.key}Type`;
            return (
              <div
                key={config.key}
                className="flex min-w-[250px] flex-1 flex-row items-center gap-2"
              >
                <label
                  htmlFor={config.key}
                  className="text-sm font-medium whitespace-nowrap text-gray-700"
                >
                  {config.label}
                </label>
                {config.searchTypes && (
                  <select
                    id={searchTypeKey}
                    value={filters[searchTypeKey] || ''}
                    onChange={(e) => handleChange(searchTypeKey, e.target.value)}
                    className="min-w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    {config.searchTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  id={config.key}
                  value={filters[config.key] || ''}
                  onChange={(e) => handleChange(config.key, e.target.value)}
                  placeholder={config.placeholder || '검색어를 입력하세요'}
                  className="min-w-[150px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

// 필터 설정

// 예약 관리 필터
export const reservationFilterConfigs: FilterConfig[] = [
  {
    type: 'select',
    key: 'period',
    label: '기간',
    defaultValue: '1일',
    options: [
      { value: '10분', label: '10분' },
      { value: '1시간', label: '1시간' },
      { value: '6시간', label: '6시간' },
      { value: '1일', label: '1일' },
      { value: '1주일', label: '1주일' },
      { value: '1개월', label: '1개월' },
    ],
  },
  {
    type: 'select',
    key: 'status',
    label: '상태',
    defaultValue: '전체',
    options: [
      { value: '전체', label: '전체' },
      { value: '예약', label: '예약' },
      { value: '취소', label: '취소' },
      { value: '완료', label: '완료' },
    ],
  },
  {
    type: 'searchWithType',
    key: 'search',
    label: '검색',
    placeholder: '검색어를 입력하세요',
    searchTypes: [
      { value: 'user', label: '유저' },
      { value: 'class', label: '클래스' },
      { value: 'center', label: '센터' },
    ],
  },
];

// 회원 관리 필터
export const userFilterConfigs: FilterConfig[] = [
  {
    type: 'select',
    key: 'role',
    label: '역할',
    defaultValue: '전체',
    options: [
      { value: '전체', label: '전체' },
      { value: '고객', label: '고객' },
      { value: '판매자', label: '판매자' },
    ],
  },
  {
    type: 'searchWithType',
    key: 'search',
    label: '검색',
    placeholder: '검색어를 입력하세요',
    searchTypes: [
      { value: 'id', label: '아이디' },
      { value: 'nickname', label: '닉네임' },
      { value: 'phone', label: '전화번호' },
      { value: 'email', label: '이메일' },
    ],
  },
];

// 클래스 관리 필터
export const classFilterConfigs: FilterConfig[] = [
  {
    type: 'select',
    key: 'status',
    label: '상태',
    defaultValue: '전체',
    options: [
      { value: '전체', label: '전체' },
      { value: '승인', label: '승인' },
      { value: '대기중', label: '대기중' },
      { value: '반려됨', label: '반려됨' },
    ],
  },
  {
    type: 'select',
    key: 'category',
    label: '카테고리',
    defaultValue: '전체',
    options: [
      { value: '전체', label: '전체' },
      { value: '헬스', label: '헬스' },
      { value: '요가', label: '요가' },
      { value: '필라테스', label: '필라테스' },
      { value: '스쿼시', label: '스쿼시' },
      { value: '복싱', label: '복싱' },
    ],
  },
  {
    type: 'select',
    key: 'difficulty',
    label: '난이도',
    defaultValue: '전체',
    options: [
      { value: '전체', label: '전체' },
      { value: '입문', label: '입문' },
      { value: '초급', label: '초급' },
      { value: '중급', label: '중급' },
      { value: '고급', label: '고급' },
    ],
  },
  {
    type: 'searchWithType',
    key: 'search',
    label: '검색',
    placeholder: '클래스명 또는 센터명 검색',
    searchTypes: [
      { value: 'className', label: '클래스명' },
      { value: 'centerName', label: '센터명' },
    ],
  },
];
