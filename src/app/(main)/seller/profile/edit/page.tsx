'use client';

import { useRef } from 'react';
import Image from 'next/image';
import InputField from '@/components/Field/InputField';
import TextAreaField from '@/components/Field/TextAreaField';
import SimpleHeader from '@/components/layout/SimpleHeader';
import CreateButton from '@/components/common/CreateButton';
import { useMemberForm } from './useMemberEditForm';
import editIcon from '@/assets/images/edit.svg';

export default function MemberEditPage() {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    profilePreview,
    handleImageChange,
    handlePhoneChange,
  } = useMemberForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen justify-center">
      <main className="relative w-full max-w-232 bg-gray-50 shadow-sm">
        <SimpleHeader title="회원 정보 수정" />

        <form id="member-edit-form" onSubmit={handleSubmit(onSubmit)} className="p-8 pb-40">
          <div className="mb-10 flex justify-center">
            <div className="relative aspect-square h-26 w-26 md:h-32 md:w-32">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-gray-100 shadow-inner">
                {profilePreview ? (
                  <Image
                    key={profilePreview} // key 추가로 이미지 변경 시 리렌더링
                    src={profilePreview}
                    alt="프로필 이미지"
                    fill
                    className="rounded-full object-cover"
                    unoptimized
                    priority
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-400">No Image</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleEditClick}
                className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-50 bg-white"
              >
                <Image src={editIcon} alt="이미지 수정" width={18} height={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <InputField
              label="닉네임"
              required
              error={errors.nickname?.message}
              {...register('nickname')}
            />
            <InputField
              label="업체명"
              required
              error={errors.companyName?.message}
              {...register('companyName')}
            />
            <InputField
              label="연락처"
              placeholder="010-0000-0000"
              required
              error={errors.contact?.message}
              {...register('contact', {
                onChange: handlePhoneChange,
              })}
            />

            <InputField
              label="도로명 주소"
              required
              error={errors.roadAddress?.message}
              {...register('roadAddress')}
            />
            <InputField
              label="상세 주소"
              placeholder="상세 주소를 입력하세요"
              error={errors.detailAddress?.message}
              {...register('detailAddress')}
            />
            <TextAreaField
              label="업체 소개"
              className="min-h-32"
              placeholder="소개를 입력하세요"
              error={errors.description?.message}
              {...register('description')}
            />

            <InputField
              label="비밀번호 변경"
              type="password"
              placeholder="변경 시에만 입력해주세요 (8자 이상)"
              error={errors.password?.message}
              {...register('password')}
            />
            <InputField
              label="새 비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.passwordConfirm?.message}
              {...register('passwordConfirm')}
            />
          </div>
        </form>

        <CreateButton type="submit" form="member-edit-form" label="수정하기" />
      </main>
    </div>
  );
}
