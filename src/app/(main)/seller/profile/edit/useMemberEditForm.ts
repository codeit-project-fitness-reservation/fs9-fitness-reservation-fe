'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { centerApi } from '@/lib/api/center';
import { userApi } from '@/lib/api/user';
import { memberFormSchema, MemberFormInput } from './memberSchema';
import { MOCK_MEMBER_DATA } from '@/mocks/centers';

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
        const data = await centerApi.getMyCenter();

        if (data && data.owner) {
          setCenterId(data.id);

          setValue('companyName', data.name);
          setValue('roadAddress', data.address1);
          setValue('detailAddress', data.address2 || '');
          setValue('description', data.introduction || '');

          setValue('nickname', data.owner.nickname);
          setValue('contact', data.owner.phone || MOCK_MEMBER_DATA.contact || '');

          const profileImage = data.owner.profileImgUrl || MOCK_MEMBER_DATA.profileImage || null;
          if (profileImage) {
            setProfilePreview(profileImage);
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
      // 유저 프로필 수정 (nickname, phone, password, profileImage)
      const profileFormData = new FormData();
      profileFormData.append('nickname', data.nickname);
      profileFormData.append('phone', data.contact);

      if (data.password && data.password.trim().length >= 8) {
        profileFormData.append('password', data.password);
      }

      if (profileFile) {
        profileFormData.append('profileImage', profileFile);
      }

      await userApi.updateSellerProfile(profileFormData);

      // 센터 정보 수정 (name, address1, address2, introduction)
      const centerData: Record<string, string> = {
        name: data.companyName,
        address1: data.roadAddress,
        address2: data.detailAddress || '',
        introduction: data.description,
      };

      await centerApi.updateCenter(centerId, centerData);

      alert('성공적으로 수정되었습니다.');

      router.push('/seller/mypage');
    } catch (error) {
      const message = error instanceof Error ? error.message : '정보 수정에 실패했습니다.';
      console.error('수정 실패:', error);
      alert(message);
    }
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
  };
}
