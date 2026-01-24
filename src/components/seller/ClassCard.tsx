import Image from 'next/image';
import { ClassItem } from '@/types';
import icUser from '@/assets/images/user-02.svg';
import StatusBadge from '@/components/common/StatusBadge';

export default function ClassCard({
  title,
  bannerUrl,
  imgUrls,
  displayCapacity,
  status,
  statusLabel,
}: ClassItem) {
  const isInactive = status === 'PENDING' || status === 'REJECTED';
  const imageUrl = bannerUrl || imgUrls?.[0];

  return (
    <div
      className={`flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left ${
        isInactive ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <div
        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-200/40 ${
          isInactive ? 'bg-gray-200 opacity-40' : 'bg-blue-100'
        }`}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="sr-only">이미지 없음</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <h3
            className={`truncate text-base font-semibold ${
              isInactive ? 'text-gray-500' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>

          {status !== 'APPROVED' && <StatusBadge status={status} label={statusLabel} />}
        </div>

        {status === 'APPROVED' && displayCapacity && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Image src={icUser} alt="인원" width={14} height={14} />
            <span className="tabular-nums">{displayCapacity}</span>
          </div>
        )}
      </div>
    </div>
  );
}
