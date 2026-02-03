import { Class } from '@/types/class';

interface RulesTabProps {
  classData: Class;
}

export default function RulesTab({ classData }: RulesTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">규정</h2>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-base leading-relaxed whitespace-pre-line text-gray-700">
          {classData.notice || '규정 사항이 없습니다.'}
        </p>
      </div>
    </div>
  );
}
