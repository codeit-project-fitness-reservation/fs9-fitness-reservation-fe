'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { reviewApi, Review } from '@/lib/api/review';
import StarIcon from '@/assets/images/Star.svg';

interface ReviewsTabProps {
  classId?: string;
  centerId?: string;
  onReviewCountChange?: (count: number) => void;
}

export default function ReviewsTab({ classId, centerId, onReviewCountChange }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!centerId) {
        setReviews([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await reviewApi.getCenterReviews(centerId);

        let allReviews: Review[] = [];
        if (Array.isArray(response)) {
          allReviews = response;
        } else if (response && typeof response === 'object') {
          if ('reviews' in response && Array.isArray((response as { reviews: unknown }).reviews)) {
            allReviews = (response as { reviews: Review[] }).reviews;
          } else if ('data' in response && Array.isArray((response as { data: unknown }).data)) {
            allReviews = (response as { data: Review[] }).data;
          }
        }

        const reviewsData = classId
          ? allReviews.filter((review) => review.classId === classId)
          : allReviews;

        setReviews(reviewsData);

        if (onReviewCountChange) {
          onReviewCountChange(reviewsData.length);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '리뷰를 불러오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, centerId]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5" aria-label={`평점 ${rating}점`}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="relative h-4 w-4 md:h-6 md:w-6">
          <Image src={StarIcon} alt="" fill className={i < rating ? '' : 'opacity-30 grayscale'} />
        </div>
      ))}
    </div>
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 bg-gray-50 p-1 md:p-1">
        <h2 className="text-[20px] font-bold text-gray-800">리뷰</h2>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 bg-gray-50 p-1 md:p-1">
        <h2 className="text-[20px] font-bold text-gray-800">리뷰</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <p className="py-20 text-center text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-50 p-1 md:p-1">
      <h2 className="text-[20px] font-bold text-gray-800">리뷰</h2>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {reviews.length === 0 ? (
          <p className="py-20 text-center text-sm text-gray-500">아직 리뷰가 없습니다.</p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-200 px-4 md:px-5">
            {reviews.map((review) => (
              <article key={review.id} className="py-4 md:py-8">
                <div className="mb-3 flex items-center">{renderStars(review.rating)}</div>

                {/* 이미지 목록 */}
                {review.imgUrls && review.imgUrls.length > 0 && (
                  <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
                    {review.imgUrls.map((image, idx) => (
                      <div
                        key={`${review.id}-img-${idx}`}
                        className={`relative shrink-0 overflow-hidden rounded ${
                          review.imgUrls?.length === 1
                            ? 'h-24.5 w-24.5 md:h-38.75 md:w-38.75'
                            : 'h-24 w-24 md:h-38.75 md:w-38.75'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`리뷰 이미지 ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 리뷰 본문 */}
                {review.content && (
                  <p className="mb-2 text-sm leading-5 font-medium text-gray-700 md:text-lg md:leading-7">
                    {review.content}
                  </p>
                )}

                {/* 작성자 정보 */}
                <div className="flex items-center gap-1 text-xs text-gray-500 md:text-sm">
                  <span>{review.user?.nickname || '익명'}</span>
                  <span className="text-gray-200">·</span>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
