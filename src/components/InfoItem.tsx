//마에피이지 주소, 연락처 부분

import Image from 'next/image';

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  alt: string;
}

export const InfoItem = ({ icon, label, value, alt }: InfoItemProps) => {
  return (
    <div className="flex w-full items-center">
      <div className="flex shrink-0 items-center gap-3">
        <div className="relative h-14 w-14 shrink-0">
          <div className="absolute top-0 left-0 h-14 w-14 rounded-full bg-gray-100" />
          <div className="absolute top-4 left-4 h-6 w-6 overflow-hidden">
            <Image src={icon} alt={alt} width={24} height={24} />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start justify-center font-medium">
          <p className="text-xs leading-4.5 text-gray-500">{label}</p>
          <p className="text-sm leading-5 text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};
