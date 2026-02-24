import { RefObject } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  selectedImages: File[];
  existingImageUrls?: string[];
  removedImageUrls?: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageSelect: (file: File) => void;
  onImageRemove: (index: number) => void;
  onExistingImageRemove?: (url: string) => void;
  onExistingImageRestore?: (url: string) => void;
}

const MAX_IMAGES = 3;

export function ImageUpload({
  selectedImages,
  existingImageUrls = [],
  removedImageUrls = [],
  fileInputRef,
  onImageSelect,
  onImageRemove,
  onExistingImageRemove,
  // onExistingImageRestore는 향후 이미지 복원 기능을 위해 예약되어 있으나 현재는 사용하지 않음
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExistingImageRestore,
}: ImageUploadProps) {
  // 삭제되지 않은 기존 이미지만 표시
  const visibleExistingImages = existingImageUrls.filter((url) => !removedImageUrls.includes(url));
  const totalImages = selectedImages.length + visibleExistingImages.length;
  const canAddMore = totalImages < MAX_IMAGES;

  return (
    <section className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-800">
        대표이미지 <span className="text-blue-500">*</span>
        <span className="ml-2 text-xs font-normal text-gray-500">(최대 {MAX_IMAGES}개)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {canAddMore && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50"
            >
              <span className="text-2xl text-gray-400">+</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // 파일명이 없거나 비어있으면 새 File 객체 생성
                  let fileToAdd = file;
                  if (!file.name || file.name.trim() === '') {
                    const extension = file.type.split('/')[1] || 'jpg';
                    const fileName = `image-${Date.now()}.${extension}`;
                    fileToAdd = new File([file], fileName, { type: file.type });
                  }
                  onImageSelect(fileToAdd);

                  e.target.value = '';
                }
              }}
            />
          </>
        )}
        {/* 기존 이미지 표시 */}
        {visibleExistingImages.map((url, index) => (
          <div
            key={`existing-${url}-${index}`}
            className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
          >
            <Image
              src={url}
              alt={`Existing image ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onExistingImageRemove?.(url)}
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] text-white hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        ))}

        {/* 새로 선택한 이미지 표시 */}
        {selectedImages.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onImageRemove(index)}
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] text-white hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
