import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { classFormSchema, ClassFormInput } from './classschema';
import { formatWithCommas } from '@/lib/utils/format';
import { classApi } from '@/lib/api/class';
import { parseDayGroup, KOREAN_TO_ENGLISH_DAY, ENGLISH_TO_KOREAN_DAY } from '@/lib/utils/schedule';

export function useClassForm(classId?: string) {
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

  useEffect(() => {
    if (!classId) return;

    const fetchClass = async () => {
      try {
        let detail;
        try {
          detail = await classApi.getClassDetail(classId);
        } catch {
          const responseData = await classApi.getClasses({ limit: 100 });
          detail = responseData?.data?.find((item) => item.id === classId);
        }

        if (!detail) {
          throw new Error('클래스를 찾을 수 없습니다.');
        }

        setValue('title', detail.title);
        setValue('category', detail.category || '');
        setValue('level', detail.level || '');
        setValue('pricePoints', formatWithCommas(String(detail.pricePoints)));
        setValue('capacity', formatWithCommas(String(detail.capacity)));
        setValue('description', detail.description || '');
        setValue('precautions', detail.notice ?? '');

        if (detail.schedule) {
          try {
            const scheduleData =
              typeof detail.schedule === 'string' ? JSON.parse(detail.schedule) : detail.schedule;

            if (
              scheduleData &&
              typeof scheduleData === 'object' &&
              Object.keys(scheduleData).length > 0
            ) {
              const formSchedule: Record<string, string[]> = {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
              };

              Object.entries(scheduleData).forEach(([dayGroup, timeStr]) => {
                if (typeof timeStr !== 'string') return;

                const days = parseDayGroup(dayGroup);
                const times = timeStr
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t);

                days.forEach((koreanDay) => {
                  const englishDay = KOREAN_TO_ENGLISH_DAY[koreanDay];
                  if (englishDay && formSchedule[englishDay]) {
                    const existingTimes = formSchedule[englishDay];
                    const allTimes = [...existingTimes, ...times];
                    formSchedule[englishDay] = Array.from(new Set(allTimes)).sort();
                  }
                });
              });

              const typedSchedule = {
                monday: formSchedule.monday || [],
                tuesday: formSchedule.tuesday || [],
                wednesday: formSchedule.wednesday || [],
                thursday: formSchedule.thursday || [],
                friday: formSchedule.friday || [],
                saturday: formSchedule.saturday || [],
                sunday: formSchedule.sunday || [],
              };

              setValue('schedule', typedSchedule);
            }
          } catch {}
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        alert(`클래스 정보를 불러오지 못했습니다: ${errorMessage}`);
      }
    };

    void fetchClass();
  }, [classId, setValue]);

  const onSubmit = async (data: ClassFormInput) => {
    if (!classId && selectedImages.length === 0) {
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

    selectedImages.forEach((file) => {
      formData.append(`images`, file);
    });

    const dayScheduleMap: Record<string, string[]> = {};
    Object.entries(data.schedule).forEach(([day, times]) => {
      if (times && times.length > 0) {
        const koreanDay = ENGLISH_TO_KOREAN_DAY[day];
        if (koreanDay) {
          const uniqueTimes = Array.from(new Set(times)).sort();
          dayScheduleMap[koreanDay] = uniqueTimes;
        }
      }
    });

    const scheduleData: Record<string, string> = {};
    const processedDays = new Set<string>();

    Object.entries(dayScheduleMap).forEach(([day, times]) => {
      if (processedDays.has(day)) return;

      const timeKey = times.join(',');
      const sameTimeDays: string[] = [day];

      Object.entries(dayScheduleMap).forEach(([otherDay, otherTimes]) => {
        if (otherDay !== day && !processedDays.has(otherDay) && otherTimes.join(',') === timeKey) {
          sameTimeDays.push(otherDay);
        }
      });

      const dayGroup = sameTimeDays
        .sort((a, b) => {
          const order = ['월', '화', '수', '목', '금', '토', '일'];
          return order.indexOf(a) - order.indexOf(b);
        })
        .join('');

      scheduleData[dayGroup] = times.join(', ');
      sameTimeDays.forEach((d) => processedDays.add(d));
    });

    formData.append('schedule', JSON.stringify(scheduleData));

    try {
      if (classId) {
        await classApi.updateClass(classId, formData);
        alert('클래스가 성공적으로 수정되었습니다!');
      } else {
        await classApi.createClass(formData);
        alert('클래스가 성공적으로 신청되었습니다!');
      }
      router.push('/seller');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes('jwt') ||
        errorMessage.includes('expired') ||
        errorMessage.includes('token')
      ) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        router.push('/login');
        return;
      }

      alert(`클래스 저장에 실패했습니다: ${errorMessage}`);
    }
  };

  const isFormValid = classId ? true : isValid && selectedImages.length > 0;

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
