'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { BaseButton } from '@/components/common/BaseButton';
import InputField from '@/components/Field/InputField';
import { userApi } from '@/lib/api/user';

import personalfotoIcon from '@/assets/images/personalfoto.svg';
import editpenIcon from '@/assets/images/editpen.svg';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await userApi.getMyProfile();
        setNickname(user.nickname);
        setPhone(user.phone);
        if (user.profileImgUrl) {
          setProfileImage(user.profileImgUrl);
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        alert('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValue = password?.trim();
    const passwordConfirmValue = confirmPassword?.trim();
    const shouldUpdatePassword = !!(passwordValue && passwordValue.length >= 8);

    if (shouldUpdatePassword && passwordValue !== passwordConfirmValue) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordValue && passwordValue.length > 0 && passwordValue.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (profileFile) {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('phone', phone);

        if (shouldUpdatePassword) {
          formData.append('password', passwordValue);
        }

        formData.append('profileImage', profileFile);

        await userApi.updateCustomerProfile(formData);
      } else {
        const jsonData: Record<string, string> = {
          nickname,
          phone,
        };

        if (shouldUpdatePassword) {
          jsonData.password = passwordValue;
        }

        await userApi.updateCustomerProfile(jsonData);
      }

      alert('회원 정보가 수정되었습니다.');
      router.push('/my');
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원 정보 수정에 실패했습니다.';
      console.error('회원 정보 수정 실패:', error);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <p className="text-base font-medium text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50 max-[640px]:bg-white">
      <SimpleHeader title="회원 정보 수정" />

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[540px] flex-col gap-6 px-4 py-6 max-[640px]:max-w-full max-[640px]:gap-4 max-[640px]:px-4 max-[640px]:py-4 md:px-6 md:py-8"
      >
        <div className="flex flex-col items-center gap-4 max-[640px]:gap-3">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-blue-50 max-[640px]:h-20 max-[640px]:w-20">
              {profileImage ? (
                <Image src={profileImage} alt="프로필" fill className="object-cover" />
              ) : (
                <Image
                  src={getSvgSrc(personalfotoIcon as SvgImport)}
                  alt="프로필"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <label
              htmlFor="profile-image"
              className="absolute right-0 bottom-0 flex cursor-pointer items-center justify-center max-[640px]:right-[-2px] max-[640px]:bottom-[-2px]"
            >
              <Image
                src={getSvgSrc(editpenIcon as SvgImport)}
                alt="편집"
                width={32}
                height={32}
                className="max-[640px]:h-7 max-[640px]:w-7"
              />
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-[640px]:gap-1.5">
          <InputField
            label="닉네임"
            required
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
          />
        </div>

        <div className="flex flex-col gap-2 max-[640px]:gap-1.5">
          <InputField
            label="연락처"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="연락처를 입력해주세요"
          />
        </div>

        <div className="flex flex-col gap-2 max-[640px]:gap-1.5">
          <InputField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="변경할 비밀번호를 입력해주세요"
          />
        </div>

        <div className="flex flex-col gap-2 max-[640px]:gap-1.5">
          <InputField
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 한 번 더 입력해주세요"
          />
        </div>

        <div className="mt-4 max-[640px]:mt-2">
          <BaseButton
            type="submit"
            variant="primary"
            className="w-full py-3 text-base font-semibold max-[640px]:py-2.5 max-[640px]:text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </BaseButton>
        </div>
      </form>
    </div>
  );
}
