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
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

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

        // 기존 이미지 URL 설정
        // imgUrls 배열이 있으면 우선 사용, 없으면 bannerUrl 사용
        let imageUrls: string[] = [];

        if (detail.imgUrls && detail.imgUrls.length > 0) {
          // imgUrls가 있으면 모든 이미지 사용
          imageUrls = [...detail.imgUrls];

          // bannerUrl이 있고 imgUrls에 없으면 추가 (중복 방지)
          if (detail.bannerUrl && !imageUrls.includes(detail.bannerUrl)) {
            imageUrls = [detail.bannerUrl, ...imageUrls];
          }
        } else if (detail.bannerUrl) {
          // imgUrls가 없고 bannerUrl만 있으면 bannerUrl만 사용
          imageUrls = [detail.bannerUrl];
        }

        // 빈 값 제거 및 중복 제거
        const uniqueImageUrls = Array.from(new Set(imageUrls.filter(Boolean)));
        setExistingImageUrls(uniqueImageUrls);
        // 수정 모드 진입 시 삭제 목록 초기화 (새로 로드한 이미지 기준)
        setRemovedImageUrls([]);

        // 디버깅용 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
          console.log('기존 이미지 로드:', {
            bannerUrl: detail.bannerUrl,
            imgUrls: detail.imgUrls,
            uniqueImageUrls,
          });
        }

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
    // 삭제되지 않은 기존 이미지 개수 계산
    const visibleExistingImages = existingImageUrls.filter(
      (url) => !removedImageUrls.includes(url),
    );
    const totalImages = visibleExistingImages.length + selectedImages.length;

    // 디버깅용 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('이미지 검증:', {
        existingImageUrls,
        removedImageUrls,
        visibleExistingImages,
        selectedImages: selectedImages.length,
        totalImages,
        classId,
      });
    }

    // 새 클래스 등록 시: 새 이미지가 필수
    if (!classId && selectedImages.length === 0) {
      alert('최소 1개의 이미지를 업로드해주세요.');
      return;
    }

    // 수정 모드: 기존 이미지가 남아있거나 새 이미지가 있어야 함
    if (classId && totalImages === 0) {
      alert('최소 1개의 이미지가 필요합니다.');
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

    // 삭제할 이미지 URL 전송 (수정 모드일 때만)
    if (classId && removedImageUrls.length > 0) {
      formData.append('removedImageUrls', JSON.stringify(removedImageUrls));
      // 디버깅용 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('삭제할 이미지 URL 전송:', removedImageUrls);
      }
    }

    selectedImages.forEach((file, index) => {
      // 파일명 정리 및 생성 함수
      const sanitizeFileName = (originalName: string): string => {
        // 파일명에서 확장자 추출
        const lastDot = originalName.lastIndexOf('.');
        const nameWithoutExt = lastDot > 0 ? originalName.substring(0, lastDot) : originalName;
        const extension = lastDot > 0 ? originalName.substring(lastDot + 1) : 'jpg';

        // 파일명 정리: 특수문자, 공백 제거, 안전한 문자만 사용
        const sanitizedName = nameWithoutExt
          .replace(/[^a-zA-Z0-9가-힣_-]/g, '-') // 특수문자를 하이픈으로 변경
          .replace(/-+/g, '-') // 연속된 하이픈을 하나로
          .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거

        // 파일명이 비어있거나 너무 짧으면 타임스탬프 사용
        const finalName = sanitizedName || `image-${Date.now()}-${index}`;

        return `${finalName}.${extension}`;
      };

      // 파일명이 없거나 비어있거나 문제가 있으면 새 File 객체 생성
      let fileToUpload = file;
      let fileName = file.name;

      if (!fileName || fileName.trim() === '' || fileName.includes('_____')) {
        const extension = file.type.split('/')[1] || 'jpg';
        fileName = `class-image-${Date.now()}-${index}.${extension}`;
      } else {
        // 파일명 정리
        fileName = sanitizeFileName(fileName);
      }

      // 파일명이 원본과 다르면 새 File 객체 생성
      if (fileName !== file.name) {
        fileToUpload = new File([file], fileName, { type: file.type });
      }

      // FormData에 파일 추가 (multer가 기대하는 형식)
      // multer는 보통 'images' 필드명으로 배열을 받음
      formData.append('images', fileToUpload, fileName);
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

  const removeExistingImage = (url: string) => {
    // removedImageUrls에만 추가 (existingImageUrls는 유지)
    setRemovedImageUrls((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  };

  const restoreExistingImage = (url: string) => {
    // removedImageUrls에서만 제거
    setRemovedImageUrls((prev) => prev.filter((u) => u !== url));
  };

  return {
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isValid,
    selectedImages,
    setSelectedImages,
    existingImageUrls,
    removedImageUrls,
    removeExistingImage,
    restoreExistingImage,
    formatWithCommas,
    onSubmit,
    isFormValid,
    trigger,
  };
}
