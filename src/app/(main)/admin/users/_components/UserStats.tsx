import { User } from '@/types';

interface UserStatsProps {
  users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
  const totalCount = users.length;
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;
  const sellerCount = users.filter((u) => u.role === 'SELLER').length;

  const stats = [
    {
      label: '총 회원',
      value: totalCount,
      unit: '건',
    },
    {
      label: '고객',
      value: customerCount,
      unit: '명',
    },
    {
      label: '판매자',
      value: sellerCount,
      unit: '명',
    },
  ];

  return (
    <div className="mb-8 flex w-full gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex h-[138px] flex-1 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
        >
          <div className="flex w-full flex-col gap-1">
            <p className="text-base leading-6 font-semibold text-gray-900">{stat.label}</p>
          </div>
          <div className="flex w-full items-end gap-1">
            <p className="text-[30px] leading-[38px] font-semibold text-gray-900">
              {stat.value.toLocaleString()}
            </p>
            <p className="pb-[2px] text-base leading-6 font-semibold text-gray-500">{stat.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
