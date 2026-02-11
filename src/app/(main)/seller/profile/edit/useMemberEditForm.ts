'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { centerApi } from '@/lib/api/center';
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

          //TODO: 추후 전화번호   mock data 제거 필요(백엔드 쪽 코드 확인 후)
          setValue('contact', data.owner.phoneNumber || MOCK_MEMBER_DATA.contact || '');

          //TODO: 추후 프로필 이미지 mock data 제거  필요(백엔드 쪽 코드 확인 후)

          const profileImage = data.owner.profileImage || MOCK_MEMBER_DATA.profileImage || null;
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
      if (profileFile) {
        const formData = new FormData();
        formData.append('nickname', data.nickname);
        formData.append('phoneNumber', data.contact);
        formData.append('name', data.companyName);
        formData.append('address1', data.roadAddress);
        formData.append('address2', data.detailAddress || '');
        formData.append('introduction', data.description);

        if (data.password && data.password.trim().length >= 8) {
          formData.append('password', data.password);
        }

        formData.append('profileImage', profileFile);

        await centerApi.updateCenter(centerId, formData);
      } else {
        const jsonData: Record<string, string> = {
          nickname: data.nickname,
          phoneNumber: data.contact,
          name: data.companyName,
          address1: data.roadAddress,
          address2: data.detailAddress || '',
          introduction: data.description,
        };

        if (data.password && data.password.trim().length >= 8) {
          jsonData.password = data.password;
        }

        await centerApi.updateCenter(centerId, jsonData);
      }

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
