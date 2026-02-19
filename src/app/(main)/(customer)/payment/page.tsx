'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import TextAreaField from '@/components/Field/TextAreaField';
import { BaseButton } from '@/components/common/BaseButton';
import PaymentClassInfo from './_components/PaymentClassInfo';
import PaymentCoupon from './_components/PaymentCoupon';
import PaymentPoints from './_components/PaymentPoints';
import PaymentSummary from './_components/PaymentSummary';
import CouponSelectModal from './_components/CouponSelectModal';
import PaymentWidget from '@/components/payment/PaymentWidget';
import { Class, ClassSlot } from '@/types/class';
import { Center, UserCoupon } from '@/types';
import { classApi } from '@/lib/api/class';
import { centerApi } from '@/lib/api/center';
import { getMockUserCouponsForClass } from '@/mocks/coupons';

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
  const [usedPoints, setUsedPoints] = useState(0);
  const [availablePoints] = useState(30000); // TODO: 실제 사용자 포인트 조회
  const [availableCoupons, setAvailableCoupons] = useState<UserCoupon[]>([]); // TODO: 실제 쿠폰 목록 조회
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const paymentWidgetsRef = useRef<unknown>(null);
  const paymentMethodWidgetRef = useRef<unknown>(null);

  useEffect(() => {
    if (!classId || !slotId) {
      router.push('/classes');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [classResponse, coupons] = await Promise.all([
          classApi.getClassDetail(classId),
          Promise.resolve(getMockUserCouponsForClass({ classId, userId: 'user-1' })), // TODO: 쿠폰 API 구현 후 교체
        ]);

        // 클래스 데이터 매핑
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
          status: classResponse.status as Class['status'],
          rejectReason: null,
          createdAt: classResponse.createdAt,
          updatedAt: classResponse.createdAt,
          currentReservation: 0,
          rating: 0,
          reviewCount: classResponse._count.reviews || 0,
        };

        setClassData(mappedClass);

        // 센터 정보 조회
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
            createdAt: new Date(centerResponse.createdAt),
            updatedAt: new Date(centerResponse.updatedAt),
          };
          setCenterData(mappedCenter);
        } catch (centerError) {
          console.error('센터 정보 조회 실패:', centerError);
          // 클래스 정보에서 센터 이름만 사용
          const fallbackCenter: Center = {
            id: classResponse.center.id,
            ownerId: '',
            name: classResponse.center.name,
            address1: classResponse.center.address1 || '',
            address2: classResponse.center.address2 ?? undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setCenterData(fallbackCenter);
        }

        // 슬롯 데이터 찾기
        if (classResponse.slots) {
          const slot = classResponse.slots.find((s) => s.id === slotId);
          if (slot) {
            const mappedSlot: ClassSlot = {
              id: slot.id,
              classId: classId,
              startAt: new Date(slot.startAt),
              endAt: new Date(slot.endAt),
              capacity: slot.capacity,
              currentReservation: slot.currentReservation ?? slot.currentReservations ?? 0,
              isOpen: slot.isOpen ?? true,
              createdAt: slot.createdAt ? new Date(slot.createdAt) : new Date(),
            };
            setSlotData(mappedSlot);
          } else {
            router.push('/classes');
            return;
          }
        } else {
          router.push('/classes');
          return;
        }

        // 쿠폰 목록 설정
        setAvailableCoupons(coupons);
        setSelectedCoupon((prev) => (prev && coupons.some((c) => c.id === prev.id) ? prev : null));
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
        router.push('/classes');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [classId, slotId, router]);

  const handlePayment = async () => {
    if (!classData || !slotData || !paymentWidgetsRef.current) return;

    try {
      const widgets = paymentWidgetsRef.current as {
        requestPayment: (options: {
          orderId: string;
          orderName: string;
          customerName: string;
          customerEmail: string;
          successUrl: string;
          failUrl: string;
        }) => Promise<void>;
      };
      const orderId = `order-${classId}-${slotId}-${Date.now()}`;

      const paymentMethodWidget = paymentMethodWidgetRef.current as {
        getSelectedPaymentMethod: () => Promise<unknown>;
      } | null;

      const selectedPaymentMethod = await paymentMethodWidget?.getSelectedPaymentMethod();
      console.log('selectedPaymentMethod: ', selectedPaymentMethod);

      await widgets.requestPayment({
        orderId,
        orderName: `${classData.title} - ${slotData.startAt}`,
        customerName: '홍길동',
        customerEmail: 'customer@example.com',
        successUrl: `${window.location.origin}/payment/success${window.location.search}`,
        failUrl: `${window.location.origin}/payment/fail${window.location.search}`,
      });
    } catch (error) {
      console.error('Payment request error:', error);
      alert('결제 요청 중 오류가 발생했습니다.');
    }
  };

  const handlePaymentWidgetReady = (widgets: unknown, paymentMethodWidget: unknown) => {
    paymentWidgetsRef.current = widgets;
    paymentMethodWidgetRef.current = paymentMethodWidget;
    setIsWidgetReady(true);
  };

  const handlePaymentMethodSelect = () => {
    // Payment method selection handled by widget
  };

  if (isLoading || !classData || !centerData || !slotData) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <p className="text-base font-medium text-gray-400">로딩 중...</p>
      </div>
    );
  }

  const couponDiscount = selectedCoupon?.template?.discountPoints || 0;
  const finalAmount = Math.max(0, classData.pricePoints - couponDiscount - usedPoints);

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
        />

        <PaymentPoints
          availablePoints={availablePoints}
          usedPoints={usedPoints}
          onPointsChange={setUsedPoints}
        />

        <div className="rounded-lg bg-white p-4">
          <PaymentSummary
            originalPrice={classData.pricePoints}
            couponDiscount={couponDiscount}
            pointsUsed={usedPoints}
          />
        </div>

        {finalAmount > 0 && (
          <div className="rounded-lg bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">결제 수단 선택</h2>
            <PaymentWidget
              customerKey={`customer-${classId}-${slotId}`}
              amount={finalAmount}
              onReady={handlePaymentWidgetReady}
              onPaymentMethodSelect={handlePaymentMethodSelect}
            />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-30 w-full border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-[960px]">
          <BaseButton
            type="button"
            variant="primary"
            onClick={handlePayment}
            className="w-full py-4 text-lg"
            disabled={finalAmount <= 0 || !isWidgetReady}
          >
            {finalAmount > 0 ? `${finalAmount.toLocaleString()}원 결제하기` : '결제하기'}
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
