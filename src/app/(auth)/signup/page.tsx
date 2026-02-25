'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/layout/Header/Header';
import InputField from '@/components/Field/InputField';
import { authFetch } from '@/lib/api';
import { parseValidationErrors } from '@/lib/parseValidationErrors';
import { setSellerDraft } from '@/lib/signupSellerDraft';
import fitmatchLogo from '@/assets/images/FITMATCH.svg';

type SignupFormInput = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  phone: string;
  role: 'CUSTOMER' | 'SELLER';
};

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'SELLER'>('CUSTOMER');

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      phone: '',
      role: 'CUSTOMER',
    },
  });

  const onSubmit = async (data: SignupFormInput) => {
    try {
      const payload = {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
        phone: data.phone,
        role: data.role,
      };
      const result = await authFetch('/api/auth/signup', { method: 'POST', body: payload });

      if (!result.ok) {
        // 백엔드 검증 오류인 경우 필드별로 오류 설정
        if (result.errorDetails) {
          const fieldErrors = parseValidationErrors(result.errorDetails);
          Object.keys(fieldErrors).forEach((field) => {
            setError(field as keyof SignupFormInput, {
              message: fieldErrors[field],
            });
          });
          // 필드별 오류가 있으면 root 오류는 표시하지 않음
          if (Object.keys(fieldErrors).length > 0) {
            return;
          }
        }
        setError('root', { message: result.error || '회원가입에 실패했습니다.' });
        return;
      }

      router.push('/login');
    } catch {
      setError('root', { message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-col overflow-hidden bg-gray-50">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-10">
        <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-[40px]">
          <div className="flex w-full flex-col items-center gap-[24px]">
            {/* Logo - Figma: 64px height, blue #2970FF */}
            <Link href="/" className="flex h-16 items-center justify-center">
              <Image src={fitmatchLogo} alt="FITMATCH" width={240} height={64} priority />
            </Link>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-[32px]">
              <input type="hidden" {...register('role')} />

              {/* 이용자 / 사업자 선택 */}
              <div className="flex w-full gap-[8px] rounded-[8px] border border-[#D5D7DA] p-[4px]">
                <button
                  type="button"
                  onClick={() => {
                    setValue('role', 'CUSTOMER');
                    setSelectedRole('CUSTOMER');
                  }}
                  className={`flex-1 rounded-[6px] py-[10px] text-[14px] leading-5 font-medium transition-colors ${
                    selectedRole === 'CUSTOMER'
                      ? 'bg-[#2970FF] text-white'
                      : 'text-gray-600 hover:bg-[#F5F6F8]'
                  }`}
                >
                  이용자
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('role', 'SELLER');
                    setSelectedRole('SELLER');
                  }}
                  className={`flex-1 rounded-[6px] py-[10px] text-[14px] leading-5 font-medium transition-colors ${
                    selectedRole === 'SELLER'
                      ? 'bg-[#2970FF] text-white'
                      : 'text-gray-600 hover:bg-[#F5F6F8]'
                  }`}
                >
                  사업자
                </button>
              </div>

              <div className="flex w-full flex-col gap-[12px]">
                <InputField
                  label="이메일"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  error={errors.email?.message}
                  required
                  density="sm"
                  {...register('email', {
                    required: '이메일을 입력해주세요',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '잘못된 이메일 형식입니다.',
                    },
                  })}
                />

                <InputField
                  label="닉네임"
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  error={errors.nickname?.message}
                  required
                  density="sm"
                  {...register('nickname', {
                    required: '닉네임을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '닉네임은 2자 이상이어야 합니다',
                    },
                  })}
                />

                <InputField
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  error={errors.password?.message}
                  required
                  density="sm"
                  showPasswordToggle={false}
                  {...register('password', {
                    required: '비밀번호를 입력해주세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 8자 이상이어야 합니다',
                    },
                  })}
                />

                <InputField
                  label="비밀번호 확인"
                  type="password"
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                  error={errors.passwordConfirm?.message}
                  required
                  density="sm"
                  showPasswordToggle={false}
                  {...register('passwordConfirm', {
                    required: '비밀번호 확인을 입력해주세요',
                    validate: (v) => v === getValues('password') || '비밀번호가 일치하지 않습니다',
                  })}
                />

                <InputField
                  label="연락처"
                  type="tel"
                  placeholder="연락처를 입력해주세요"
                  error={errors.phone?.message}
                  required
                  inputMode="numeric"
                  density="sm"
                  maxLength={11}
                  {...register('phone', {
                    required: '연락처를 입력해주세요',
                    pattern: {
                      value: /^\d{10,11}$/,
                      message: '올바른 전화번호 형식이 아닙니다.',
                    },
                  })}
                />

                {errors.root && (
                  <p className="rounded-[8px] bg-[#FEF3F2] px-4 py-3 text-[14px] leading-5 text-[#D92D20]">
                    {errors.root.message}
                  </p>
                )}
              </div>

              <div className="flex w-full gap-[8px]">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                    setValue('role', 'SELLER');
                    const valid = await trigger([
                      'email',
                      'nickname',
                      'password',
                      'passwordConfirm',
                      'phone',
                    ]);
                    if (!valid) return;
                    const v = getValues();
                    setSellerDraft({
                      email: v.email,
                      nickname: v.nickname,
                      password: v.password,
                      phone: v.phone,
                    });
                    router.push('/signup/seller');
                  }}
                  className="flex h-12 flex-1 items-center justify-center rounded-[8px] border border-[#D5D7DA] bg-white px-[18px] py-3 text-base leading-6 font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  사업자 가입하기
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => setValue('role', 'CUSTOMER')}
                  className="flex h-12 flex-1 items-center justify-center rounded-[8px] border-2 border-white/10 bg-[#2970FF] px-[18px] py-3 text-base leading-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  이용자 가입하기
                </button>
              </div>
            </form>
          </div>

          {/* Login link */}
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
