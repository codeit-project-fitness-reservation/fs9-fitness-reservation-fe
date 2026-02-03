import { Class } from '@/types/class';

interface ClassTagsProps {
  classData: Class;
}

export default function ClassTags({ classData }: ClassTagsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md bg-blue-50 px-3 py-1">
        <p className="text-sm font-medium text-blue-700">{classData.category}</p>
      </div>
      <div className="flex items-center rounded-md bg-gray-100 px-3 py-1">
        <p className="text-sm font-medium text-gray-700">{classData.level}</p>
      </div>
    </div>
  );
}
