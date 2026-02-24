import { useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { userApi } from '@/lib/api/user';
import { reservationApi } from '@/lib/api/reservation';
import { pointApi } from '@/lib/api/point';
import { couponApi } from '@/lib/api/coupon';
import { format, subMonths } from 'date-fns';
import GivePointModal from './GivePointModal';
import GiveCouponModal from './GiveCouponModal';
import UserCouponsModal from './UserCouponsModal';

interface UserDetailModalProps {
  userId: string;
  onClose: () => void;
}

const ROLE_MAP: Record<string, string> = {
  ADMIN: '관리자',
  SELLER: '판매자',
  CUSTOMER: '일반',
};

export default function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [recentStats, setRecentStats] = useState({
    reservationCount: 0,
    cancelCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeSubModal, setActiveSubModal] = useState<'NONE' | 'POINT' | 'COUPON' | 'COUPON_LIST'>(
    'NONE',
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await userApi.getUserById(userId);
      setUser(userData);

      const oneMonthAgo = format(subMonths(new Date(), 1), 'yyyy-MM-dd');

      // 병렬 요청으로 최근 예약/취소 건수 조회
      const [bookedRes, completedRes, canceledRes] = await Promise.all([
        reservationApi.getAdminReservations({
          userId,
          startDate: oneMonthAgo,
          status: 'BOOKED',
        }),
        reservationApi.getAdminReservations({
          userId,
          startDate: oneMonthAgo,
          status: 'COMPLETED',
        }),
        reservationApi.getAdminReservations({
          userId,
          startDate: oneMonthAgo,
          status: 'CANCELED',
        }),
      ]);

      const getTotal = (res: { total?: number; totalCount?: number }) =>
        res?.total ?? res?.totalCount ?? 0;
      const bookedCount = getTotal(bookedRes as { total?: number; totalCount?: number });
      const completedCount = getTotal(completedRes as { total?: number; totalCount?: number });
      const canceledCount = getTotal(canceledRes as { total?: number; totalCount?: number });

      setRecentStats({
        reservationCount: bookedCount + completedCount,
        cancelCount: canceledCount,
      });
    } catch (error) {
      console.error('회원 상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  const handleGivePoint = async (amount: number, memo: string) => {
    try {
      await pointApi.adjustPoint({ userId, amount, memo });
      alert('포인트가 지급/차감되었습니다.');
      fetchData(); // 데이터 갱신
    } catch (error) {
      console.error('포인트 지급 실패:', error);
      alert('포인트 지급에 실패했습니다.');
    }
  };

  const handleGiveCoupon = async (couponId: string) => {
    try {
      await couponApi.issueCoupon({ userId, templateId: couponId });
      alert('쿠폰이 지급되었습니다.');
      fetchData(); // 데이터 갱신
    } catch (error) {
      console.error('쿠폰 지급 실패:', error);
      alert('쿠폰 지급에 실패했습니다.');
    }
  };

  if (!user && loading) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-[720px] rounded-3xl bg-white p-8 shadow-xl">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col gap-6">
            {/* 1. 기본 정보 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-900">기본 정보</h2>
              <div className="rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col gap-2 text-base font-medium">
                  <InfoRow label="역할" value={ROLE_MAP[user?.role || 'CUSTOMER']} />
                  <InfoRow label="닉네임" value={user?.nickname} />
                  <InfoRow label="아이디" value={user?.id} />
                  <InfoRow label="이메일" value={user?.email} />
                  <InfoRow label="연락처" value={user?.phone} />
                  <InfoRow
                    label="가입일"
                    value={user ? format(new Date(user.createdAt), 'yyyy. MM. dd') : '-'}
                  />
                </div>
              </div>
            </div>

            {/* 2. 이용 현황 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-900">이용 현황</h2>
              <div className="rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col gap-2 text-base font-medium">
                  <InfoRow
                    label="보유 포인트"
                    value={`${user?.pointBalance.toLocaleString() || 0}P`}
                  />
                  <InfoRow
                    label="보유 쿠폰"
                    value={`${user?.couponCount?.toLocaleString() ?? 0}장`}
                  />
                  <InfoRow label="최근 예약" value={`${recentStats.reservationCount}건`} />
                  <InfoRow label="최근 취소" value={`${recentStats.cancelCount}건`} />
                </div>
              </div>
            </div>

            {/* 3. 쿠폰 목록 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">보유 쿠폰</h2>
                <button
                  onClick={() => setActiveSubModal('COUPON_LIST')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  상세 보기 →
                </button>
              </div>
              <div className="rounded-xl border border-gray-200 px-6 py-3">
                <p className="text-sm text-gray-500">
                  {user?.couponCount?.toLocaleString() ?? 0}장 보유 중
                </p>
              </div>
            </div>

            {/* 4. 하단 버튼 */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setActiveSubModal('POINT')}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                포인트 지급
              </button>
              <button
                onClick={() => setActiveSubModal('COUPON')}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                쿠폰 지급
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeSubModal === 'POINT' && user && (
        <GivePointModal
          user={user}
          onClose={() => setActiveSubModal('NONE')}
          onConfirm={handleGivePoint}
        />
      )}

      {activeSubModal === 'COUPON' && user && (
        <GiveCouponModal
          user={user}
          onClose={() => setActiveSubModal('NONE')}
          onConfirm={handleGiveCoupon}
        />
      )}
      {activeSubModal === 'COUPON_LIST' && user && (
        <UserCouponsModal
          userId={userId}
          userNickname={user.nickname}
          onClose={() => setActiveSubModal('NONE')}
        />
      )}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 text-gray-400">{label}</span>
      <span className="text-gray-900">{value || '-'}</span>
    </div>
  );
}
