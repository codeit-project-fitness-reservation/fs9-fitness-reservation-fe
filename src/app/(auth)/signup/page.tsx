'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import InputField from '@/components/Field/InputField';
import { authFetch } from '@/lib/api';
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput>({
    mode: 'onChange', // 입력하는 동안 실시간 검증
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      phone: '',
      role: 'CUSTOMER',
    },
  });

  const password = watch('password');

  const parseValidationErrors = (details: string) => {
    // 백엔드 검증 오류 형식: "body.email: 올바른 이메일 형식이어야 합니다, body.password: 비밀번호는 8자 이상이어야 합니다"
    const errorMap: Record<string, string> = {};

    if (!details) return errorMap;

    const errors = details.split(', ');
    errors.forEach((error) => {
      const [path, ...messageParts] = error.split(': ');
      if (path && messageParts.length > 0) {
        // "body.email" -> "email", "body.password" -> "password"
        const fieldName = path.replace('body.', '');
        errorMap[fieldName] = messageParts.join(': ');
      }
    });

    return errorMap;
  };

  const onSubmit = async (data: SignupFormInput) => {
    try {
      const { passwordConfirm, ...payload } = data;
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
    } catch (error) {
      setError('root', { message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SimpleHeader title="회원가입" />
      <div className="flex flex-1 flex-col px-6 py-10">
        <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-[40px]">
          <div className="flex w-full flex-col items-center gap-[24px]">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center">
              <Image src={fitmatchLogo} alt="FITMATCH" width={240} height={64} priority />
            </Link>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-[32px]">
              {/* role은 CTA 버튼 클릭으로 설정 */}
              <input type="hidden" {...register('role')} />

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
                    validate: (v) => v === password || '비밀번호가 일치하지 않습니다',
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
                  maxLength={10}
                  {...register('phone', {
                    required: '연락처를 입력해주세요',
                    pattern: { value: /^\d{10}$/, message: '연락처는 숫자 10자리여야 합니다' },
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
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => setValue('role', 'SELLER')}
                  className="flex h-[48px] flex-1 items-center justify-center rounded-[8px] border border-[#D5D7DA] bg-white px-[18px] py-[12px] text-[16px] leading-6 font-semibold text-[#414651] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  사업자 가입하기
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => setValue('role', 'CUSTOMER')}
                  className="flex h-[48px] flex-1 items-center justify-center rounded-[8px] bg-[#2970FF] px-[18px] py-[12px] text-[16px] leading-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  이용자 가입하기
                </button>
              </div>
            </form>
          </div>

          {/* Login link */}
          <div className="flex items-center justify-center gap-[4px] text-[14px] leading-5">
            <span className="text-[#535862]">이미 회원이신가요?</span>
            <Link href="/login" className="text-[#155EEF] underline underline-offset-2">
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
