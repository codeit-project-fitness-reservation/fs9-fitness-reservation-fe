'use client';

import { useRouter } from 'next/navigation';
import { Class } from '@/types/class';
import ClassCard from '@/app/(main)/(customer)/classes/_components/ClassCard';

interface CenterClassesProps {
  classes: Class[];
}

export default function CenterClasses({ classes }: CenterClassesProps) {
  const router = useRouter();

  const handleClassClick = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  if (classes.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">진행중인 클래스</h2>
        <p className="text-base text-gray-400">진행 중인 클래스가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">진행중인 클래스</h2>
      <div className="flex flex-col gap-3">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classData={classItem}
            onClick={() => handleClassClick(classItem.id)}
          />
        ))}
      </div>
    </div>
  );
}
