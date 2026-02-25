'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import InputField from '@/components/Field/InputField';
import DatePicker from '@/components/common/DatePicker';
import ModalFooterButtons from '@/components/common/ModalFooterButtons';
import { couponApi, CreateCouponInput, CouponTemplate, UpdateCouponInput } from '@/lib/api/coupon';
import { couponFormSchema, CouponFormInput } from './couponSchema';
import icClose from '@/assets/images/x-close.svg';

interface CreateCouponModalProps {
  onClose: () => void;
  onSuccess: () => void;
  couponId?: string;
  initialData?:
    | CouponTemplate
    | {
        name: string;
        discountPoints?: number;
        discountPercentage?: number;
        expiresAt?: Date | string;
      };
}

export default function CreateCouponModal({
  onClose,
  onSuccess,
  couponId,
  initialData,
}: CreateCouponModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditMode = !!couponId;

  const toFormValues = (
    data: CreateCouponModalProps['initialData'],
  ): Partial<CouponFormInput> | null => {
    if (!data) return null;
    const isApiFormat = 'discountType' in data && 'usageValue' in data;
    const rawPoints = isApiFormat
      ? data.discountType === 'AMOUNT'
        ? data.usageValue
        : undefined
      : (data as { discountPoints?: number | null }).discountPoints;
    const rawPercentage = isApiFormat
      ? data.discountType === 'PERCENTAGE'
        ? data.usageValue
        : undefined
      : (data as { discountPercentage?: number | null }).discountPercentage;
    const discountPoints = typeof rawPoints === 'number' && rawPoints > 0 ? rawPoints : undefined;
    const discountPercentage =
      typeof rawPercentage === 'number' && rawPercentage > 0 ? rawPercentage : undefined;
    const discountType: 'amount' | 'percentage' =
      isApiFormat && (data as { discountType?: string }).discountType === 'PERCENTAGE'
        ? 'percentage'
        : discountPercentage != null
          ? 'percentage'
          : 'amount';
    const expiresAt = data.expiresAt
      ? typeof data.expiresAt === 'string'
        ? new Date(data.expiresAt)
        : data.expiresAt
      : undefined;
    return {
      name: data.name || '',
      discountType,
      discountPoints,
      discountPercentage,
      expiresAt,
    };
  };

  const formDefaults = toFormValues(initialData);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<CouponFormInput>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      name: formDefaults?.name ?? '',
      discountType: formDefaults?.discountType ?? 'amount',
      discountPoints: formDefaults?.discountPoints,
      discountPercentage: formDefaults?.discountPercentage,
      expiresAt: formDefaults?.expiresAt,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const values = toFormValues(initialData);
    if (values) {
      reset(values);
      void trigger();
    }
  }, [initialData, reset, trigger]);

  const discountType = watch('discountType');

  const onSubmit = async (data: CouponFormInput) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const discountTypeApi = discountType === 'amount' ? 'AMOUNT' : 'PERCENTAGE';
      const usageValue =
        discountType === 'amount' ? (data.discountPoints ?? 0) : (data.discountPercentage ?? 0);
      const expiresAtStr = data.expiresAt ? data.expiresAt.toISOString() : undefined;

      if (isEditMode && couponId) {
        const updateData: UpdateCouponInput = {
          name: data.name,
          discountType: discountTypeApi,
          usageValue,
          expiresAt: expiresAtStr,
        };
        await couponApi.updateCouponTemplate(couponId, updateData);
      } else {
        const submitData: CreateCouponInput = {
          name: data.name,
          discountType: discountTypeApi,
          usageValue,
          expiresAt: expiresAtStr,
        };
        await couponApi.createCouponTemplate(submitData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-h-[90vh] w-85.75 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl md:w-130">
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <h2 className="text-lg font-bold text-[#111827]">
          {isEditMode ? '쿠폰 수정' : '쿠폰 만들기'}
        </h2>
        <button
          onClick={onClose}
          className="transition-hover flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
          aria-label="닫기"
        >
          <Image src={icClose} alt="닫기" width={24} height={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col gap-6">
          <InputField
            label="쿠폰 이름"
            placeholder="쿠폰 이름을 입력해주세요"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={discountType === 'amount'}
                  onChange={() => setValue('discountType', 'amount')}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${discountType === 'amount' ? 'border-[#2970FF] bg-[#2970FF]' : 'border-[#D1D5DB] bg-white'}`}
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <span className="text-sm font-medium text-[#374151]">금액 할인</span>
              </label>
              <Controller
                name="discountPoints"
                control={control}
                render={({ field }) => (
                  <InputField
                    label=""
                    type="number"
                    placeholder="숫자만 입력해주세요"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    error={errors.discountPoints?.message}
                    rightElement={<span className="pr-1 text-sm text-[#6B7280]">P</span>}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                    }
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={discountType === 'percentage'}
                  onChange={() => setValue('discountType', 'percentage')}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${discountType === 'percentage' ? 'border-[#2970FF] bg-[#2970FF]' : 'border-[#D1D5DB] bg-white'}`}
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <span className="text-sm font-medium text-[#374151]">비율 할인</span>
              </label>
              <Controller
                name="discountPercentage"
                control={control}
                render={({ field }) => (
                  <InputField
                    label=""
                    type="number"
                    placeholder="숫자만 입력해주세요"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    error={errors.discountPercentage?.message}
                    rightElement={<span className="pr-1 text-sm text-[#6B7280]">%</span>}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                    }
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              만료일 <span className="text-[#2970FF]">*</span>
            </label>
            <Controller
              name="expiresAt"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  placeholder="날짜를 선택해주세요."
                />
              )}
            />
            {errors.expiresAt && (
              <p className="mt-1 text-xs text-red-500">{errors.expiresAt.message}</p>
            )}
          </div>
        </div>

        {submitError && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">{submitError}</div>
        )}

        <ModalFooterButtons
          submitLabel={isEditMode ? '수정' : '등록'}
          submitLoadingLabel={isEditMode ? '수정 중...' : '등록 중...'}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
      </form>
    </div>
  );
}
