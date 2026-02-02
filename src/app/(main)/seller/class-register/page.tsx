'use client';

import { useRef } from 'react';
import InputField from '@/components/Field/InputField';
import TextAreaField from '@/components/Field/TextAreaField';
import { useClassForm } from './useClassForm';
import { categoryOptions, levelOptions, numericFields } from './classschema';
import { RadioGroup } from './components/RadioGroup';
import { NumericInputField } from './components/NumericInputField';
import { ImageUpload } from './components/ImageUpload';
import { TimeSlotSelector } from './components/TimeSlotSelector';

export default function RegisterClassPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    selectedImages,
    setSelectedImages,
    onSubmit,
    isFormValid,
    trigger,
    errors,
  } = useClassForm();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] pb-24">
      <div className="w-full px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pt-4">
          {/* 클래스명*/}
          <section className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-800">
              클래스명 <span className="text-blue-500">*</span>
            </label>
            <InputField
              placeholder="클래스명을 입력해주세요"
              error={errors.title?.message}
              {...register('title')}
            />
          </section>

          {/* 카테고리 & 난이도 선택 */}
          <div className="flex flex-col gap-3">
            <RadioGroup
              label="카테고리"
              name="category"
              options={categoryOptions}
              control={control}
              setValue={setValue}
              trigger={trigger}
              error={errors.category?.message}
            />
            <RadioGroup
              label="난이도"
              name="level"
              options={levelOptions}
              control={control}
              setValue={setValue}
              trigger={trigger}
              error={errors.level?.message}
            />
          </div>

          {/* 가격 & 인원 입력  */}
          <div className="flex flex-col gap-6 md:flex-row md:gap-4">
            {numericFields.map((field) => (
              <NumericInputField key={field.name} field={field} control={control} />
            ))}
          </div>

          {/* 대표 이미지 업로드*/}
          <ImageUpload
            selectedImages={selectedImages}
            fileInputRef={fileInputRef}
            onImageSelect={(file) => {
              // File 객체를 그대로 저장
              setSelectedImages([...selectedImages, file]);
            }}
            onImageRemove={(index) => {
              setSelectedImages(selectedImages.filter((_, i) => i !== index));
            }}
          />

          {/* 상세 소개 입력 */}
          <section className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-800">
              상세 소개 <span className="text-blue-500">*</span>
            </label>
            <TextAreaField
              placeholder="상세 소개를 입력해주세요."
              error={errors.description?.message}
              {...register('description')}
            />
          </section>

          {/* 주의사항 입력 */}
          <section className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-800">
              주의사항 <span className="text-blue-500">*</span>
            </label>
            <TextAreaField
              placeholder="주의사항을 입력해주세요."
              error={errors.precautions?.message}
              {...register('precautions')}
            />
          </section>

          {/* 시간대 선택 */}
          <TimeSlotSelector control={control} />

          <div className="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-200 bg-white px-4 pt-3 pb-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full rounded-lg py-3 text-base font-semibold transition-all ${
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]'
                  : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
              }`}
            >
              신청하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
