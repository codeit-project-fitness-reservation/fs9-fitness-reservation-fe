import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { classFormSchema, ClassFormInput } from './classschema';

export function useClassForm() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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

    const payload = {
      ...data,
      id: Date.now().toString(),
      status: 'PENDING',
      statusLabel: '대기중',
      centerId: 'center-1',
      pricePoints: Number(data.pricePoints.replace(/[^0-9]/g, '')),
      capacity: Number(data.capacity.replace(/[^0-9]/g, '')),
      imgUrls: selectedImages,
      displayCapacity: `0/${Number(data.capacity.replace(/[^0-9]/g, ''))}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schedule: Object.entries(data.schedule)
        .filter(([, time]) => !!time)
        .reduce(
          (acc, [day, time]) => {
            if (time) acc[day] = time;
            return acc;
          },
          {} as Record<string, string>,
        ),
    };

    //  기존 로컬 스토리지 데이터 불러오기
    const existingClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const updatedClasses = [payload, ...existingClasses];

    //  로컬 스토리지에 다시 저장
    localStorage.setItem('myClasses', JSON.stringify(updatedClasses));

    alert('클래스가 성공적으로 등록되었습니다!');

    // 판매자 메인 페이지로 이동
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
