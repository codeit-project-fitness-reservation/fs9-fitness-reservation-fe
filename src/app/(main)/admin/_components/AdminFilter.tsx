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
  /** true면 외부 카드 없이 필터 행만 렌더 (상위 카드 안에 넣을 때 사용) */
  inline?: boolean;
}

export default function AdminFilter({
  configs,
  onFilterChange,
  initialValues = {},
  inline = false,
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

  const content = (
    <div className="flex flex-row flex-nowrap items-center justify-end gap-4 overflow-x-auto">
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
            <div key={config.key} className="flex shrink-0 flex-row items-center gap-2">
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
              <div className="relative w-[220px] shrink-0">
                <input
                  type="text"
                  id={config.key}
                  value={filters[config.key] || ''}
                  onChange={(e) => handleChange(config.key, e.target.value)}
                  placeholder={config.placeholder || '검색어를 입력해주세요.'}
                  className="w-full rounded-md border border-gray-300 py-2 pr-9 pl-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <span
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                  aria-hidden
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );

  if (inline) return content;
  return <div className="rounded-lg border border-gray-200 bg-white p-4">{content}</div>;
}

// 필터 설정

// 예약 관리 필터
export const reservationFilterConfigs: FilterConfig[] = [
  {
    type: 'select',
    key: 'period',
    label: '기간',
    defaultValue: '전체기간',
    options: [
      { value: '10분', label: '10분' },
      { value: '1시간', label: '1시간' },
      { value: '6시간', label: '6시간' },
      { value: '1일', label: '1일' },
      { value: '1주일', label: '1주일' },
      { value: '1개월', label: '1개월' },
      { value: '전체기간', label: '전체기간' },
    ],
  },
  {
    type: 'select',
    key: 'status',
    label: '상태',
    defaultValue: '전체',
    options: [
      { value: '전체', label: '전체' },
      { value: 'BOOKED', label: '예약' },
      { value: 'CANCELED', label: '취소' },
      { value: 'COMPLETED', label: '완료' },
    ],
  },
  {
    type: 'searchWithType',
    key: 'search',
    label: '검색',
    placeholder: '검색어를 입력해주세요.',
    searchTypes: [
      { value: 'User', label: '유저' },
      { value: 'Class', label: '클래스' },
      { value: 'Center', label: '센터' },
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
      { value: 'CUSTOMER', label: '고객' },
      { value: 'SELLER', label: '판매자' },
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
      { value: 'APPROVED', label: '승인' },
      { value: 'PENDING', label: '대기중' },
      { value: 'REJECTED', label: '반려됨' },
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
    placeholder: '검색어를 입력해주세요.',
    searchTypes: [
      { value: 'className', label: '클래스명' },
      { value: 'centerName', label: '센터명' },
    ],
  },
];
