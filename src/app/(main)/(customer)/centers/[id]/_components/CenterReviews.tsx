'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Review } from '@/types';
import { MOCK_REVIEWS } from '@/mocks/reviews';
import { MOCK_CLASS_LIST } from '@/mocks/mockdata';
import starIcon from '@/assets/images/Star.svg';
import starBackgroundIcon from '@/assets/images/Star background.svg';
import personalfotoIcon from '@/assets/images/personalfoto.svg';
import emptyStateIcon from '@/assets/images/Empty State.svg';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

interface CenterReviewsProps {
  centerId: string;
}

export default function CenterReviews({ centerId }: CenterReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = () => {
      setIsLoading(true);
      try {
        const centerClasses = MOCK_CLASS_LIST.filter((c) => c.centerId === centerId);
        const classIds = centerClasses.map((c) => c.id);

        const centerReviews = MOCK_REVIEWS.filter((review) => classIds.includes(review.classId));
        setReviews(centerReviews);
      } catch (error) {
        console.error('리뷰 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();

    const interval = setInterval(fetchReviews, 2000);

    return () => clearInterval(interval);
  }, [centerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Image
          src={getSvgSrc(emptyStateIcon)}
          alt="리뷰 없음"
          width={120}
          height={120}
          className="opacity-50"
        />
        <p className="text-base text-gray-500">아직 작성된 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-[640px]:gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 max-[640px]:text-base">
          리뷰 ({reviews.length})
        </h2>
      </div>

      <div className="flex flex-col gap-6 max-[640px]:gap-4">
        {reviews.map((review) => {
          const classData = MOCK_CLASS_LIST.find((c) => c.id === review.classId);

          return (
            <div
              key={review.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 max-[640px]:gap-2 max-[640px]:p-3"
            >
              <div className="flex items-start gap-3 max-[640px]:gap-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-blue-50 max-[640px]:h-8 max-[640px]:w-8">
                  {review.userProfileImg ? (
                    <Image
                      src={review.userProfileImg}
                      alt={review.userNickname || '사용자'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src={getSvgSrc(personalfotoIcon)}
                      alt={review.userNickname || '사용자'}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2 max-[640px]:gap-1.5">
                    <p className="text-sm font-semibold text-gray-900 max-[640px]:text-xs">
                      {review.userNickname || '익명'}
                    </p>
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Image
                          key={index}
                          src={getSvgSrc(index < review.rating ? starIcon : starBackgroundIcon)}
                          alt={index < review.rating ? '별점 선택됨' : '별점 미선택'}
                          width={16}
                          height={16}
                          className="max-[640px]:h-3 max-[640px]:w-3"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {classData && (
                      <p className="text-xs font-medium text-gray-700 max-[640px]:text-[10px]">
                        {classData.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 max-[640px]:text-[10px]">
                      {format(new Date(review.createdAt), 'yyyy.MM.dd')}
                    </p>
                  </div>
                </div>
              </div>

              {review.content && (
                <p className="text-sm leading-relaxed text-gray-700 max-[640px]:text-xs">
                  {review.content}
                </p>
              )}

              {review.imgUrls && review.imgUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 max-[640px]:gap-1.5">
                  {review.imgUrls.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 max-[640px]:h-16 max-[640px]:w-16"
                    >
                      <Image
                        src={imgUrl}
                        alt={`리뷰 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
