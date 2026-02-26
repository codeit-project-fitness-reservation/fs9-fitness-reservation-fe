'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import InputField from '@/components/Field/InputField';
import { authFetch } from '@/lib/api';
import { parseValidationErrors } from '@/lib/parseValidationErrors';
import { getSellerDraft, clearSellerDraft } from '@/lib/signupSellerDraft';
import fitmatchLogo from '@/assets/images/FITMATCH.svg';

type CenterFormInput = {
  centerName: string;
  address1: string;
  address2?: string;
};

export default function SignupSellerPage() {
  const router = useRouter();
  const [draft] = useState<ReturnType<typeof getSellerDraft>>(() => getSellerDraft());
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CenterFormInput>({
    mode: 'onChange',
    defaultValues: {
      centerName: '',
      address1: '',
      address2: '',
    },
  });

  useEffect(() => {
    if (!draft) router.replace('/signup');
  }, [draft, router]);

  const onSubmit = async (data: CenterFormInput) => {
    if (!draft) return;
    setRootError(null);
    try {
      const payload = {
        ...draft,
        role: 'SELLER' as const,
        center: {
          name: data.centerName,
          address1: data.address1,
          address2: data.address2 || undefined,
        },
      };
      const result = await authFetch('/api/auth/signup', { method: 'POST', body: payload });

      if (!result.ok) {
        if (result.errorDetails) {
          const fieldErrors = parseValidationErrors(result.errorDetails);
          Object.keys(fieldErrors).forEach((field) => {
            setError(field as keyof CenterFormInput, {
              message: fieldErrors[field],
            });
          });
          if (Object.keys(fieldErrors).length > 0) return;
        }
        setRootError(result.error || '회원가입에 실패했습니다.');
        return;
      }

      clearSellerDraft();
      router.push('/login');
    } catch {
      setRootError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (draft === null) {
    return null;
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#FAFAFA]">
      <SimpleHeader title="사업자 가입" />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-10">
        <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-[40px]">
          <div className="flex w-full flex-col items-center gap-[24px]">
            <Link href="/" className="flex h-16 items-center justify-center">
              <Image src={fitmatchLogo} alt="FITMATCH" width={240} height={64} priority />
            </Link>

            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-[32px]">
              <div className="flex w-full flex-col gap-[24px]">
                <InputField
                  label="센터명"
                  type="text"
                  placeholder="센터명을 입력해주세요"
                  error={errors.centerName?.message}
                  required
                  density="sm"
                  {...register('centerName', {
                    required: '센터명을 입력해주세요',
                    minLength: { value: 1, message: '센터명을 입력해주세요' },
                  })}
                />
                <InputField
                  label="도로명 주소"
                  type="text"
                  placeholder="도로명 주소를 입력해주세요"
                  error={errors.address1?.message}
                  required
                  density="sm"
                  {...register('address1', {
                    required: '도로명 주소를 입력해주세요',
                    minLength: { value: 1, message: '도로명 주소를 입력해주세요' },
                  })}
                />
                <InputField
                  label="상세 주소"
                  type="text"
                  placeholder="상세 주소를 입력해주세요"
                  error={errors.address2?.message}
                  density="sm"
                  {...register('address2')}
                />

                {rootError && (
                  <p className="rounded-[8px] bg-[#FEF3F2] px-4 py-3 text-[14px] leading-5 text-[#D92D20]">
                    {rootError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-[8px] border-2 border-white/10 bg-[#2970FF] px-[18px] py-3 text-base leading-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                회원가입
              </button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-[4px] text-[14px] leading-5">
            <span className="text-gray-600">이미 회원이신가요?</span>
            <Link href="/login" className="text-[#155EEF] underline underline-offset-2">
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
