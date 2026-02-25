'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import TextAreaField from '@/components/Field/TextAreaField';
import { BaseButton } from '@/components/common/BaseButton';
import PaymentClassInfo from './_components/PaymentClassInfo';
import PaymentCoupon from './_components/PaymentCoupon';
import PaymentPoints from './_components/PaymentPoints';
import PaymentSummary from './_components/PaymentSummary';
import CouponSelectModal from './_components/CouponSelectModal';
import { Class, ClassSlot } from '@/types/class';
import { Center, UserCoupon } from '@/types';
import { classApi } from '@/lib/api/class';
import { centerApi } from '@/lib/api/center';
import { userApi } from '@/lib/api/user';
import { pointApi } from '@/lib/api/point';
import { couponApi } from '@/lib/api/coupon';
import { reservationApi } from '@/lib/api/reservation';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const slotId = searchParams.get('slotId');

  const [classData, setClassData] = useState<Class | null>(null);
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [slotData, setSlotData] = useState<ClassSlot | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon | null>(null);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<UserCoupon[]>([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!classId || !slotId) {
      router.push('/classes');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResult, pointResult, couponsResult] = await Promise.all([
          userApi.getMyProfile(),
          pointApi.getMyBalance(),
          couponApi.getMyCoupons(),
        ]);
        setAvailablePoints(pointResult.pointBalance);
        setAvailableCoupons(couponsResult);
      } catch (userError) {
        console.error('사용자/포인트/쿠폰 조회 실패:', userError);
        try {
          const pointResult = await pointApi.getMyBalance();
          setAvailablePoints(pointResult.pointBalance);
        } catch {
          // ignore
        }
        try {
          const couponsResult = await couponApi.getMyCoupons();
          setAvailableCoupons(couponsResult);
        } catch {
          // ignore
        }
      }

      try {
        const classResponse = await classApi.getClassDetail(classId);

        const mappedClass: Class = {
          id: classResponse.id,
          centerId: classResponse.center.id,
          title: classResponse.title,
          category: classResponse.category,
          level: classResponse.level,
          description: classResponse.description ?? null,
          notice: classResponse.notice ?? null,
          pricePoints: classResponse.pricePoints,
          capacity: classResponse.capacity,
          bannerUrl: classResponse.bannerUrl ?? null,
          imgUrls: classResponse.imgUrls || [],
          status: classResponse.status,
          rejectReason: null,
          createdAt: classResponse.createdAt,
          updatedAt: classResponse.createdAt,
          currentReservation: 0,
          rating: 0,
          reviewCount: classResponse._count?.reviews || 0,
        };

        setClassData(mappedClass);

        try {
          const centerResponse = await centerApi.getCenterDetail(classResponse.center.id);
          const mappedCenter: Center = {
            id: centerResponse.id,
            ownerId: centerResponse.ownerId,
            name: centerResponse.name,
            address1: centerResponse.address1,
            address2: centerResponse.address2 ?? undefined,
            introduction: centerResponse.introduction ?? undefined,
            businessHours: (centerResponse.businessHours as Record<string, unknown>) ?? undefined,
            lat: centerResponse.lat ?? undefined,
            lng: centerResponse.lng ?? undefined,
            createdAt: centerResponse.createdAt,
            updatedAt: centerResponse.updatedAt,
          };
          setCenterData(mappedCenter);
        } catch {
          setCenterData({
            id: classResponse.center.id,
            ownerId: '',
            name: classResponse.center.name,
            address1: classResponse.center.address1 || '',
            address2: classResponse.center.address2 ?? undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        if (classResponse.slots) {
          const slot = classResponse.slots.find((s) => s.id === slotId);
          if (slot) {
            setSlotData({
              id: slot.id,
              classId: classId,
              startAt: typeof slot.startAt === 'string' ? slot.startAt : slot.startAt.toISOString(),
              endAt: typeof slot.endAt === 'string' ? slot.endAt : slot.endAt.toISOString(),
              capacity: slot.capacity,
              currentReservation: slot.currentReservation ?? slot.currentReservations ?? 0,
              isOpen: slot.isOpen ?? true,
              createdAt:
                typeof slot.createdAt === 'string'
                  ? slot.createdAt
                  : (slot.createdAt?.toISOString() ?? new Date().toISOString()),
            });
          } else {
            router.push('/classes');
            return;
          }
        } else {
          router.push('/classes');
          return;
        }
      } catch (error) {
        console.error('클래스/센터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
        router.push('/classes');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [classId, slotId, router]);

  const handleReservation = async () => {
    if (!slotId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await reservationApi.createReservation({
        slotId,
        userCouponId: selectedCoupon?.id,
      });
      router.push('/my/reservations');
    } catch (error) {
      const message = error instanceof Error ? error.message : '예약에 실패했습니다.';
      if (
        message.includes('포인트') ||
        message.includes('INSUFFICIENT') ||
        message.includes('부족')
      ) {
        alert('포인트가 부족합니다. 포인트를 충전한 뒤 다시 시도해주세요.');
        return;
      }
      if (message.includes('쿠폰') || message.includes('COUPON') || message.includes('만료')) {
        alert('선택한 쿠폰을 사용할 수 없습니다. 쿠폰을 다시 선택하거나 제거해주세요.');
        return;
      }
      if (message.includes('정원') || message.includes('FULL') || message.includes('마감')) {
        alert('해당 시간대 예약이 마감되었습니다. 다른 시간을 선택해주세요.');
        return;
      }
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !classData || !centerData || !slotData) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <p className="text-base font-medium text-gray-400">로딩 중...</p>
      </div>
    );
  }

  const calculateCouponDiscount = (): number => {
    if (!selectedCoupon) return 0;
    const { discountPoints, discountPercentage } = selectedCoupon;
    if (discountPoints != null && discountPoints > 0) return discountPoints;
    if (discountPercentage != null && discountPercentage > 0) {
      return Math.floor((classData.pricePoints * discountPercentage) / 100);
    }
    return 0;
  };

  const couponDiscount = calculateCouponDiscount();
  const finalAmount = Math.max(0, classData.pricePoints - couponDiscount);

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="결제하기" />

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4 py-6 max-[768px]:px-4 md:px-8">
        <PaymentClassInfo classData={classData} centerData={centerData} slotData={slotData} />

        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-gray-900">요청사항</label>
          <TextAreaField
            placeholder="요청사항을 입력해주세요"
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            className="h-24"
          />
        </div>

        <PaymentCoupon
          availableCoupons={availableCoupons}
          selectedCoupon={selectedCoupon}
          onCouponSelect={setSelectedCoupon}
          onCouponModalOpen={() => setIsCouponModalOpen(true)}
          couponDiscountDisplay={couponDiscount}
        />

        <PaymentPoints availablePoints={availablePoints} paymentPoints={finalAmount} />

        <div className="rounded-lg bg-white p-4">
          <PaymentSummary
            originalPrice={classData.pricePoints}
            couponDiscount={couponDiscount}
            finalAmount={finalAmount}
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-30 w-full border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-[960px] space-y-2">
          <BaseButton
            type="button"
            variant="primary"
            onClick={handleReservation}
            className="w-full py-4 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? '예약 처리 중...' : '예약하기'}
          </BaseButton>
        </div>
      </div>

      <CouponSelectModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        availableCoupons={availableCoupons}
        selectedCoupon={selectedCoupon}
        onSelect={setSelectedCoupon}
      />
    </div>
  );
}
