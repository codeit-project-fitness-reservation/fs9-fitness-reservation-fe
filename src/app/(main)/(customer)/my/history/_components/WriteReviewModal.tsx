'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import xCloseIcon from '@/assets/images/x-close.svg';
import starIcon from '@/assets/images/Star.svg';
import starBackgroundIcon from '@/assets/images/Star background.svg';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; content: string; images: File[] }) => void;
  isLoading?: boolean;
}

export default function WriteReviewModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = images.length + newFiles.length;

    // 최대 3개까지만 업로드 가능
    if (totalFiles > 3) {
      alert('이미지는 최대 3개까지 업로드 가능합니다.');
      return;
    }

    const validFiles = totalFiles > 3 ? newFiles.slice(0, 3 - images.length) : newFiles;

    setImages((prev) => [...prev, ...validFiles]);

    // 미리보기 생성
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    onSubmit({ rating, content: content.trim(), images });
  };

  const handleClose = () => {
    if (!isLoading) {
      setRating(0);
      setContent('');
      setImages([]);
      setImagePreviews([]);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div
        className="relative mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        style={{ width: '560px' }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">리뷰 쓰기</h2>
          <button
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-center text-gray-400 transition-opacity hover:opacity-70"
            disabled={isLoading}
          >
            <Image src={getSvgSrc(xCloseIcon)} alt="닫기" width={20} height={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                onClick={() => handleStarClick(index)}
                className="focus:outline-none"
                disabled={isLoading}
                type="button"
              >
                <Image
                  src={getSvgSrc(index < rating ? starIcon : starBackgroundIcon)}
                  alt={index < rating ? '별점 선택됨' : '별점 미선택'}
                  width={40}
                  height={40}
                  className="transition-transform hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-900">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요."
            className="min-h-[120px] w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-900">이미지</label>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                  <Image src={preview} alt={`이미지 ${index + 1}`} fill className="object-cover" />
                </div>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs text-white transition-colors hover:bg-gray-700"
                  disabled={isLoading}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}

            {images.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-500"
                disabled={isLoading}
                type="button"
              >
                <span className="text-2xl">+</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClose}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-[#3182F6] py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || rating === 0 || !content.trim()}
          >
            {isLoading ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
