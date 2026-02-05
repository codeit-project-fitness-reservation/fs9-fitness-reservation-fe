import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { classFormSchema, ClassFormInput } from './classschema';
import { formatWithCommas } from '@/lib/utils/format';
import { apiClient } from '@/lib/api/client';
import { Class } from '@/types/class';

export function useClassForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('id') ?? undefined;
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingClass, setExistingClass] = useState<Class | null>(null);
  const [isLoadingClass, setIsLoadingClass] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm<ClassFormInput>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      title: '',
      category: '',
      level: '',
      pricePoints: '',
      capacity: '',
      description: '',
      precautions: '',
      schedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    },
    mode: 'onChange',
  });

  // API: 수정 모드 - 기존 클래스 데이터 불러오기 (GET /classes/:id)
  useEffect(() => {
    const fetchClassDetail = async () => {
      if (!classId) return;

      try {
        setIsLoadingClass(true);
        const data: Class = await apiClient.get(`/classes/${classId}`);
        setExistingClass(data);

        const formData = {
          title: data.title,
          category: data.category,
          level: data.level,
          pricePoints: formatWithCommas(data.pricePoints.toString()),
          capacity: data.capacity.toString(),
          description: data.description || '',
          precautions: data.notice || '',
          schedule: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          },
        };

        reset(formData, {
          keepDefaultValues: false,
          keepErrors: false,
          keepDirty: false,
          keepIsSubmitted: false,
          keepTouched: false,
          keepIsValid: false,
          keepSubmitCount: false,
        });

        // 폼 검증 트리거 (비동기로 처리)
        setTimeout(async () => {
          await trigger();
        }, 100);
      } catch (error) {
        console.error('Error fetching class detail:', error);
        alert('클래스 정보를 불러오는데 실패했습니다.');
        router.push('/seller');
      } finally {
        setIsLoadingClass(false);
      }
    };

    fetchClassDetail();
  }, [classId, reset, trigger, router]);

  const onSubmit = async (data: ClassFormInput) => {
    // 이미지 검증 (수정 모드에서는 기존 이미지가 있으면 통과)
    const hasExistingImages = existingClass?.imgUrls && existingClass.imgUrls.length > 0;

    if (selectedImages.length === 0 && !hasExistingImages) {
      alert('최소 1개의 이미지를 업로드해주세요.');
      return;
    }

    try {
      const formData = new FormData();

      // 기본 필드
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('level', data.level);
      formData.append('pricePoints', data.pricePoints.replace(/[^0-9]/g, ''));
      formData.append('capacity', data.capacity.replace(/[^0-9]/g, ''));
      formData.append('description', data.description);
      formData.append('notice', data.precautions); // precautions -> notice

      // 이미지 파일 추가
      selectedImages.forEach((file) => {
        formData.append('images', file);
      });

      // 스케줄 데이터
      const scheduleData = Object.entries(data.schedule)
        .filter(([, times]) => times && times.length > 0)
        .reduce(
          (acc, [day, times]) => {
            if (times && times.length > 0) acc[day] = times;
            return acc;
          },
          {} as Record<string, string[]>,
        );
      formData.append('schedule', JSON.stringify(scheduleData));

      console.log('=== FormData 내용 ===');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      // API 호출: 생성 또는 수정
      if (classId) {
        // PATCH /classes/:id - 클래스 수정
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/classes/${classId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
            },
            body: formData, // FormData는 Content-Type을 자동으로 설정
          },
        );
        alert('클래스가 성공적으로 수정되었습니다!');
      } else {
        // POST /classes - 클래스 생성
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/classes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
          },
          body: formData, // FormData는 Content-Type을 자동으로 설정
        });
        alert('클래스가 성공적으로 등록되었습니다!');
      }

      router.push('/seller');
    } catch (error) {
      console.error('Error submitting class:', error);
      alert(error instanceof Error ? error.message : '클래스 등록/수정 중 오류가 발생했습니다.');
    }
  };

  // 수정 모드에서는 기존 이미지가 있으면 통과
  const isFormValid = useMemo(() => {
    const hasExistingImages = existingClass?.imgUrls && existingClass.imgUrls.length > 0;
    return isValid && (selectedImages.length > 0 || hasExistingImages);
  }, [isValid, selectedImages.length, existingClass]);

  return {
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isValid,
    selectedImages,
    setSelectedImages,
    formatWithCommas,
    onSubmit,
    isFormValid,
    trigger,
    isLoadingClass,
    existingClass,
  };
}
