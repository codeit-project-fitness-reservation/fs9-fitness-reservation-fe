import { NotificationItem } from '@/types';
import Image from 'next/image';
import icX from '@/assets/images/x.svg';

interface NotificationDropdownProps {
  items: NotificationItem[];
  onReadAll: () => void;
  onReadOne: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NotificationDropdown = ({
  items,
  onReadAll,
  onReadOne,
  onDelete,
}: NotificationDropdownProps) => (
  <div className="absolute top-full right-0 z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-2xl border border-[#D5D7DA] bg-white text-left shadow-lg">
    <div className="flex items-center justify-between border-b border-[#D5D7DA] px-4 py-3">
      <p className="text-[15px] font-bold text-gray-900">알림</p>
      <button
        onClick={onReadAll}
        className="text-[12px] whitespace-nowrap text-gray-500 hover:underline"
      >
        전체 읽음
      </button>
    </div>
    <ul className="divide-y divide-[#D5D7DA]">
      {items.length > 0 ? (
        items.map((item) => (
          <li
            key={item.id}
            onClick={() => onReadOne(item.id)}
            className={`cursor-pointer p-4 hover:bg-gray-50 ${item.isRead ? 'opacity-50' : ''} group relative`}
          >
            <div className="pr-8">
              <p className="text-[13px] leading-relaxed text-gray-800">{item.message}</p>
              <p className="mt-1 text-[11px] text-gray-400">{item.date}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="absolute top-3 right-3 p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-600"
              aria-label="알림 삭제"
            >
              <Image src={icX} alt="삭제" width={14} height={14} />
            </button>
          </li>
        ))
      ) : (
        <li className="p-8 text-center text-[13px] text-gray-400">새로운 알림이 없습니다.</li>
      )}
    </ul>
  </div>
);
