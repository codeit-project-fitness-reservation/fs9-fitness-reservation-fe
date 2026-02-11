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
import { MOCK_CENTER_LIST } from '@/mocks/centers';
import { MOCK_CLASS_LIST } from '@/mocks/mockdata';
import { getMockClassSlotsForDate } from '@/mocks/classSlots';
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

    // TODO: API 호출로 대체
    const mockClass = MOCK_CLASS_LIST.find((c) => c.id === classId);
    if (!mockClass) {
      router.push('/classes');
      return;
    }

    const mockCenter = MOCK_CENTER_LIST.find((c) => c.id === mockClass.centerId);
    if (!mockCenter) {
      router.push('/classes');
      return;
    }

    // 슬롯 데이터 찾기
    const slots = getMockClassSlotsForDate({ classId, date: new Date() });
    const slot = slots.find((s) => s.id === slotId);

    if (!slot) {
      router.push('/classes');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClassData(mockClass);

    setCenterData(mockCenter);

    setSlotData(slot);

    // TODO: 사용 가능한 쿠폰 목록 조회
    const mockCoupons = getMockUserCouponsForClass({ classId, userId: 'user-1' });
    setAvailableCoupons(mockCoupons);
    setSelectedCoupon((prev) => (prev && mockCoupons.some((c) => c.id === prev.id) ? prev : null));

    setIsLoading(false);
  }, [classId, slotId, router]);

  const handlePayment = async () => {
    if (!classData || !slotData || !paymentWidgetsRef.current) return;

    try {
      const widgets = paymentWidgetsRef.current;
      const orderId = `order-${classId}-${slotId}-${Date.now()}`;

      const selectedPaymentMethod =
        await paymentMethodWidgetRef.current?.getSelectedPaymentMethod();
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

  const handlePaymentMethodSelect = (_paymentMethod: unknown) => {
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
