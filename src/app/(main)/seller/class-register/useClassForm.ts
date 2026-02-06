import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { classFormSchema, ClassFormInput } from './classschema';
import { formatWithCommas } from '@/lib/utils/format';
import { classApi } from '@/lib/api/class';

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

  const onSubmit = async (data: ClassFormInput) => {
    if (selectedImages.length === 0) {
      alert('최소 1개의 이미지를 업로드해주세요.');
      return;
    }

    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('level', data.level);
    formData.append('pricePoints', data.pricePoints.replace(/[^0-9]/g, ''));
    formData.append('capacity', data.capacity.replace(/[^0-9]/g, ''));
    formData.append('description', data.description);
    formData.append('notice', data.precautions);

    // 이미지 파일 추가
    selectedImages.forEach((file) => {
      formData.append(`images`, file);
    });

    const scheduleData = Object.entries(data.schedule)
      .filter(([, times]) => times && times.length > 0)
      .reduce(
        (acc, [day, times]) => {
          if (times && times.length > 0) acc[day] = times[0];
          return acc;
        },
        {} as Record<string, string>,
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

    try {
      await classApi.createClass(formData);
      alert('클래스가 성공적으로 신청되었습니다!');
      router.push('/seller');
    } catch (error) {
      console.error('클래스 신청 실패:', error);
      alert('클래스 신청에 실패했습니다.');
    }
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
    onSubmit,
    isFormValid,
    trigger,
  };
}
