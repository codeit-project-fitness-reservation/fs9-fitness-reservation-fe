import { User } from '@/_mock/user';
import { format } from 'date-fns';

interface UserListProps {
  users: User[];
  loading?: boolean;
}

const ROLE_MAP: Record<string, string> = {
  ADMIN: '관리자',
  SELLER: '판매자',
  CUSTOMER: '고객',
};

export default function UserList({ users, loading }: UserListProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3">가입일</th>
              <th className="px-6 py-3">역할</th>
              <th className="px-6 py-3">닉네임</th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">이메일</th>
              <th className="px-6 py-3">전화번호</th>
              <th className="px-6 py-3">보유 포인트</th>
              <th className="px-6 py-3">보유 쿠폰</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">
                    {format(new Date(user.createdAt), 'yyyy.MM.dd')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                      {ROLE_MAP[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{user.nickname}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="font-mono text-xs">{user.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-gray-900">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-900">{user.pointBalance.toLocaleString()}P</td>
                  <td className="px-6 py-4 text-gray-900">{user.couponCount.toLocaleString()}개</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
