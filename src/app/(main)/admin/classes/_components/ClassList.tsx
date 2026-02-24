import { useState } from 'react';
import { ClassItem } from '@/lib/api/class';
import { format } from 'date-fns';
import StatusChip from '@/components/StatusChip';
import ClassDetailModal from './ClassDetailModal';

interface ClassListProps {
  classes: ClassItem[];
  loading: boolean;
  onRefresh?: () => void;
  noCard?: boolean;
  columnVariant?: 'default' | 'approval';
}

export default function ClassList({
  classes,
  loading,
  onRefresh,
  noCard,
  columnVariant = 'default',
}: ClassListProps) {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const handleOpenModal = (item: ClassItem) => {
    setSelectedClass(item);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  const isApproval = columnVariant === 'approval';

  const tableContent = (
    <div className={noCard ? 'border-t border-gray-100' : ''}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3">{isApproval ? '날짜' : '등록일'}</th>
              <th className="px-6 py-3">센터</th>
              <th className="px-6 py-3">클래스</th>
              <th className="px-6 py-3">{isApproval ? '결제 포인트' : '가격'}</th>
              <th className="px-6 py-3">상태</th>
              <th className="px-6 py-3">정원</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              classes.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleOpenModal(row)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenModal(row);
                    }
                  }}
                >
                  <td className="px-6 py-4 text-gray-900">
                    {format(new Date(row.createdAt), 'yyyy.MM.dd')}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{row.center.name}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.title}</td>
                  <td className="px-6 py-4 text-gray-900">{row.pricePoints.toLocaleString()}P</td>
                  <td className="px-6 py-4">
                    <StatusChip status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-900">{row.capacity}명</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {noCard ? (
        tableContent
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">{tableContent}</div>
      )}
      <ClassDetailModal
        classItem={selectedClass}
        isOpen={!!selectedClass}
        onClose={handleCloseModal}
        onStatusChange={onRefresh}
      />
    </>
  );
}
