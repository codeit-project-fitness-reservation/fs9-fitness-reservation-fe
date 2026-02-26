'use client';

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/layout/Header/Header';
import InputField from '@/components/Field/InputField';
import { BaseButton } from '@/components/common/BaseButton';
import { authFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { parseValidationErrors } from '@/lib/parseValidationErrors';
import fitmatchLogo from '@/assets/images/FITMATCH.svg';

type LoginFormInput = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      const result = await authFetch<{
        user: { id: string; role: string; nickname: string };
      }>('/api/auth/login', { method: 'POST', body: data });

      if (!result.ok) {
        if (result.errorDetails) {
          const fieldErrors = parseValidationErrors(result.errorDetails);
          Object.keys(fieldErrors).forEach((field) => {
            setError(field as keyof LoginFormInput, {
              message: fieldErrors[field],
            });
          });
          if (Object.keys(fieldErrors).length > 0) {
            return;
          }
        }
        setError('root', { message: result.error || '로그인에 실패했습니다.' });
        return;
      }

      const { user } = result.data!;
      // setUser → status = 'authenticated' → (auth)/layout.tsx가 redirect 처리
      setUser({
        id: user.id,
        role: user.role as 'CUSTOMER' | 'SELLER' | 'ADMIN',
        nickname: user.nickname,
      });
    } catch {
      setError('root', { message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-col overflow-hidden bg-gray-50">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10">
        <div className="flex w-full max-w-[400px] flex-col items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <Image src={fitmatchLogo} alt="FITMATCH" width={240} height={64} priority />
          </Link>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4">
              <InputField
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요"
                error={errors.email?.message}
                required
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '잘못된 이메일 형식입니다',
                  },
                })}
              />
              <InputField
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                error={errors.password?.message}
                required
                {...register('password', {
                  required: '비밀번호를 입력해주세요',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 8자 이상이어야 합니다',
                  },
                })}
              />
            </div>

            {errors.root && (
              <p className="bg-error-50 text-error-600 rounded-lg px-4 py-3 text-sm">
                {errors.root.message}
              </p>
            )}

            <BaseButton
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </BaseButton>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500">
            아직 회원이 아니신가요?{' '}
            <Link
              href="/signup"
              className="font-semibold text-blue-500 underline-offset-2 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
