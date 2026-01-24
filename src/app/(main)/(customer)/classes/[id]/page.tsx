'use client';

import { useParams } from 'next/navigation';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl flex-col gap-8 px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">클래스 상세 페이지</h1>
        <p className="text-base text-gray-600">클래스 ID: {classId}</p>
        <p className="text-sm text-gray-500">이 페이지는 추후 구현 예정입니다.</p>
      </div>
    </div>
  );
}
