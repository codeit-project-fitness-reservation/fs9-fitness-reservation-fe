'use client';

import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import InputField from '@/components/Field/InputField';
import TextAreaField from '@/components/Field/TextAreaField';
import CreateButton from '@/components/common/CreateButton';
import { useClassForm } from './useClassForm';
import { categoryOptions, levelOptions, numericFields } from './classschema';
import { RadioGroup } from './components/RadioGroup';
import { NumericInputField } from './components/NumericInputField';
import { ImageUpload } from './components/ImageUpload';
import { TimeSlotSelector } from './components/TimeSlotSelector';

export default function RegisterClassPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const classId = searchParams.get('id');
  const isEditMode = classId !== null;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    selectedImages,
    setSelectedImages,
    existingImageUrls,
    removedImageUrls,
    removeExistingImage,
    restoreExistingImage,
    onSubmit,
    isFormValid,
    trigger,
    errors,
  } = useClassForm(classId || undefined);

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-200/40">
      <main className="relative flex w-full max-w-240 flex-col bg-[#FAFAFA] shadow-sm">
        <form
          id="class-register-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 px-8 pt-12 pb-32"
        >
          {/* 클래스명 */}
          <section className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-800">
              클래스명 <span className="text-blue-500">*</span>
            </label>
            <InputField
              placeholder="클래스명을 입력해주세요"
              error={errors?.title?.message}
              {...register('title')}
            />
          </section>

          {/* 카테고리 & 난이도 */}
          <div className="flex flex-col gap-8">
            <RadioGroup
              label="카테고리"
              name="category"
              options={categoryOptions}
              control={control}
              setValue={setValue}
              trigger={trigger}
              error={errors?.category?.message}
            />
            <RadioGroup
              label="난이도"
              name="level"
              options={levelOptions}
              control={control}
              setValue={setValue}
              trigger={trigger}
              error={errors?.level?.message}
            />
          </div>

          {/* 가격 & 인원 */}

          <div className="flex flex-col gap-6">
            {numericFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <NumericInputField field={field} control={control} />
              </div>
            ))}
          </div>
          {/* 이미지 업로드 */}

          <ImageUpload
            selectedImages={selectedImages}
            existingImageUrls={existingImageUrls}
            removedImageUrls={removedImageUrls}
            fileInputRef={fileInputRef}
            onImageSelect={(file) => {
              setSelectedImages((prev: File[]) => [...prev, file]);
            }}
            onImageRemove={(index: number) => {
              setSelectedImages((prev: File[]) => prev.filter((_, i) => i !== index));
            }}
            onExistingImageRemove={removeExistingImage}
            onExistingImageRestore={restoreExistingImage}
          />

          {/* 상세 소개 */}
          <section className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-800">
              상세 소개 <span className="text-blue-500">*</span>
            </label>
            <TextAreaField
              className="min-h-60"
              placeholder="상세 소개를 입력해주세요."
              error={errors?.description?.message}
              {...register('description')}
            />
          </section>

          {/* 주의사항 */}
          <section className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-800">
              주의사항 <span className="text-blue-500">*</span>
            </label>
            <TextAreaField
              className="min-h-35"
              placeholder="주의사항을 입력해주세요."
              error={errors?.precautions?.message}
              {...register('precautions')}
            />
          </section>

          {/* 시간 선택 */}
          <TimeSlotSelector control={control} />
        </form>

        <CreateButton
          type="submit"
          form="class-register-form"
          label={isEditMode ? '수정하기' : '신청하기'}
          disabled={!isFormValid}
        />
      </main>
    </div>
  );
}
