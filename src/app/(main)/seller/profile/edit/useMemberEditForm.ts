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
        // User 정보와 Center 정보를 병렬로 가져오기
        const [userData, centerData] = await Promise.all([authApi.me(), centerApi.getMyCenter()]);

        // Center 정보 설정
        if (centerData) {
          setCenterId(centerData.id);
          setValue('companyName', centerData.name);
          setValue('roadAddress', centerData.address1);
          setValue('detailAddress', centerData.address2 || '');
          setValue('description', centerData.introduction || '');
        }

        // User 정보 설정 (phone과 profileImage는 user에서 가져옴)
        if (userData) {
          setValue('nickname', userData.nickname);
          // 전화번호 포맷팅 적용
          setValue('contact', formatPhoneNumber(userData.phone));
          // API 응답에서 profileImgUrl 또는 profileImage 사용
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
      // 비밀번호 변경 여부 확인 (8자 이상 입력된 경우에만 변경)
      const passwordValue = data.password?.trim();
      const passwordConfirmValue = data.passwordConfirm?.trim();
      const shouldUpdatePassword = passwordValue && passwordValue.length >= 8;

      // 비밀번호가 입력된 경우, 비밀번호 확인도 함께 전송 (백엔드 검증을 위해)
      if (shouldUpdatePassword && passwordValue !== passwordConfirmValue) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      // 판매자 프로필 및 센터 정보를 함께 업데이트 (PUT /api/auth/seller/me)
      // 백엔드 updateSellerProfile 함수가 User와 Center를 모두 업데이트함
      const sellerProfileData: FormData | Record<string, string> = profileFile
        ? (() => {
            const formData = new FormData();
            // 판매자 프로필 정보
            formData.append('nickname', data.nickname);
            formData.append('phone', data.contact);
            // 비밀번호 변경 (입력된 경우에만 추가)
            if (shouldUpdatePassword && passwordValue) {
              formData.append('password', passwordValue);
              // 백엔드 검증을 위해 passwordConfirm도 함께 전송
              if (passwordConfirmValue) {
                formData.append('passwordConfirm', passwordConfirmValue);
              }
            }
            formData.append('profileImage', profileFile);
            // 센터 정보 (백엔드가 centerName으로 받음)
            formData.append('centerName', data.companyName);
            formData.append('address1', data.roadAddress);
            formData.append('address2', data.detailAddress || '');
            formData.append('introduction', data.description);
            return formData;
          })()
        : {
            // 판매자 프로필 정보
            nickname: data.nickname,
            phone: data.contact,
            // 비밀번호 변경 (입력된 경우에만 추가)
            ...(shouldUpdatePassword && passwordValue
              ? {
                  password: passwordValue,
                  // 백엔드 검증을 위해 passwordConfirm도 함께 전송
                  ...(passwordConfirmValue ? { passwordConfirm: passwordConfirmValue } : {}),
                }
              : {}),
            // 센터 정보 (백엔드가 centerName으로 받음)
            centerName: data.companyName,
            address1: data.roadAddress,
            address2: data.detailAddress || '',
            introduction: data.description,
          };

      await authApi.updateSellerProfile(sellerProfileData);

      alert('성공적으로 수정되었습니다.');

      // 마이페이지로 이동하고 데이터 새로고침
      router.push('/seller/mypage');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : '정보 수정에 실패했습니다.';
      console.error('수정 실패:', error);
      console.error('에러 상세:', error instanceof Error ? error.stack : error);
      alert(message);
    }
  };

  // 전화번호 입력 핸들러 (자동 하이픈 추가)
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
