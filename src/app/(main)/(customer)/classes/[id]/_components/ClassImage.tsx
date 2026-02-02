import Image from 'next/image';
import { Class } from '@/types/class';

interface ClassImageProps {
  classData: Class;
}

export default function ClassImage({ classData }: ClassImageProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl max-[768px]:h-[300px]">
      {classData.bannerUrl ? (
        <Image
          src={classData.bannerUrl}
          alt={classData.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
          이미지 없음
        </div>
      )}
    </div>
  );
}
