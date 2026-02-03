import { Class } from '@/types/class';

interface IntroTabProps {
  classData: Class;
}

export default function IntroTab({ classData }: IntroTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">클래스 소개</h2>
      <p className="text-base leading-relaxed whitespace-pre-line text-gray-700">
        {classData.description}
      </p>
    </div>
  );
}
