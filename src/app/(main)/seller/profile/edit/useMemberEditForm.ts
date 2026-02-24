'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { centerApi } from '@/lib/api/center';
import { authApi, MeResponse } from '@/lib/api/auth';
import { memberFormSchema, MemberFormInput } from './memberSchema';
import { formatPhoneNumber, formatPhoneInput } from '@/lib/utils/format';

export function useMemberForm() {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [centerId, setCenterId] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<MemberFormInput>({
    resolver: zodResolver(memberFormSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const [userData, centerData] = await Promise.all([authApi.me(), centerApi.getMyCenter()]);

        if (centerData) {
          setCenterId(centerData.id);
          setValue('companyName', centerData.name);
          setValue('roadAddress', centerData.address1);
          setValue('detailAddress', centerData.address2 || '');
          setValue('description', centerData.introduction || '');
        }

        if (userData) {
          setValue('nickname', userData.nickname);
          setValue('contact', formatPhoneNumber(userData.phone));

          const userDataWithImgUrl = userData as MeResponse;
          const profileImageUrl = userDataWithImgUrl.profileImgUrl || userData.profileImage;
          if (profileImageUrl) {
            setProfilePreview(profileImageUrl);
          }
        }
      } catch (error) {
        console.error('정보를 불러오는데 실패했습니다:', error);
      }
    };
    fetchMemberData();
  }, [setValue]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: MemberFormInput) => {
    if (!centerId) return;

    try {
      const passwordValue = data.password?.trim();
      const passwordConfirmValue = data.passwordConfirm?.trim();
      const shouldUpdatePassword = !!(passwordValue && passwordValue.length >= 8);

      // 프론트엔드 검증: 비밀번호 입력 시 일치 여부 확인
      if (shouldUpdatePassword && passwordValue !== passwordConfirmValue) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const sellerProfileData: FormData | Record<string, string> = profileFile
        ? (() => {
            const formData = new FormData();
            formData.append('nickname', data.nickname);
            formData.append('phone', data.contact);

            if (shouldUpdatePassword) {
              formData.append('password', passwordValue);
            }

            formData.append('profileImage', profileFile);
            formData.append('centerName', data.companyName);
            formData.append('address1', data.roadAddress);
            formData.append('address2', data.detailAddress || '');
            formData.append('introduction', data.description);
            return formData;
          })()
        : {
            nickname: data.nickname,
            phone: data.contact,
            ...(shouldUpdatePassword ? { password: passwordValue } : {}),
            centerName: data.companyName,
            address1: data.roadAddress,
            address2: data.detailAddress || '',
            introduction: data.description,
          };

      await authApi.updateSellerProfile(sellerProfileData);

      alert('성공적으로 수정되었습니다.');
      router.push('/seller/mypage');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : '정보 수정에 실패했습니다.';
      console.error('수정 실패:', error);
      alert(message);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setValue('contact', formatted, { shouldValidate: true });
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    onSubmit,
    profilePreview,
    handleImageChange,
    handlePhoneChange,
  };
}
