import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { classFormSchema, ClassFormInput } from './classschema';

export function useClassForm() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<ClassFormInput>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      title: '',
      category: '',
      level: '',
      pricePoints: '',
      capacity: '',
      description: '',
      schedule: {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    },
    mode: 'onChange',
  });

  const formatWithCommas = (value: number | string) => {
    if (!value) return '';
    const num = typeof value === 'string' ? Number(value.replace(/[^0-9]/g, '')) : value;
    return num.toLocaleString('ko-KR');
  };

  const getError = (fieldName: keyof ClassFormInput) => errors[fieldName]?.message;

  const onSubmit = (data: ClassFormInput) => {
    if (selectedImages.length === 0) {
      alert('최소 1개의 이미지를 업로드해주세요.');
      return;
    }

    // FormData 생성
    const formData = new FormData();

    // 기본 필드 추가
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('level', data.level);
    formData.append('pricePoints', data.pricePoints.replace(/[^0-9]/g, ''));
    formData.append('capacity', data.capacity.replace(/[^0-9]/g, ''));
    formData.append('description', data.description);

    // 이미지 파일 추가 (File 객체 그대로)
    selectedImages.forEach((file) => {
      formData.append(`images`, file);
    });

    // 스케줄 JSON.stringify로 문자열로 변환하여 추가
    const scheduleData = Object.entries(data.schedule)
      .filter(([, time]) => !!time)
      .reduce(
        (acc, [day, time]) => {
          if (time) acc[day] = time;
          return acc;
        },
        {} as Record<string, string>,
      );
    formData.append('schedule', JSON.stringify(scheduleData));

    // FormData 내용 확인 (개발용)
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
    console.log('===================');

    // TODO: 실제 API 호출 시 사용
    // const response = await fetch('/api/classes', {
    //   method: 'POST',
    //   body: formData, // Content-Type은 자동으로 multipart/form-data로 설정됨
    // });

    // 임시: 로컬 스토리지 저장 (개발용)
    const payload = {
      ...data,
      id: Date.now().toString(),
      status: 'PENDING',
      statusLabel: '대기중',
      centerId: 'center-1',
      pricePoints: Number(data.pricePoints.replace(/[^0-9]/g, '')),
      capacity: Number(data.capacity.replace(/[^0-9]/g, '')),
      imgUrls: selectedImages.map((file) => URL.createObjectURL(file)), // 임시 미리보기용
      displayCapacity: `0/${Number(data.capacity.replace(/[^0-9]/g, ''))}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schedule: scheduleData,
    };

    const existingClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const updatedClasses = [payload, ...existingClasses];
    localStorage.setItem('myClasses', JSON.stringify(updatedClasses));

    alert('클래스가 성공적으로 등록되었습니다!');
    router.push('/seller');
  };

  const isFormValid = isValid && selectedImages.length > 0;

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
    getError,
    onSubmit,
    isFormValid,
    trigger,
  };
}
