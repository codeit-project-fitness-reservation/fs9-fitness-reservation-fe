import { Class } from '@/types/class';

interface ClassImageProps {
  classData: Class;
}

export default function ClassImage({ classData }: ClassImageProps) {
  return (
    <div
      className="h-[400px] w-full max-[768px]:h-[300px]"
      style={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
        background: classData.bannerUrl
          ? `url(${classData.bannerUrl}) lightgray 50% / cover no-repeat`
          : 'lightgray',
      }}
    />
  );
}
