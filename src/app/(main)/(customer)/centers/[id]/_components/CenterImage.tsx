import { Center } from '@/types';

interface CenterImageProps {
  centerData: Center;
}

export default function CenterImage({ centerData }: CenterImageProps) {
  return (
    <div
      className="h-[400px] w-full max-[768px]:h-[300px]"
      style={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
        background: centerData.profileImgUrl
          ? `url(${centerData.profileImgUrl}) lightgray 50% / cover no-repeat`
          : 'lightgray',
      }}
    />
  );
}
