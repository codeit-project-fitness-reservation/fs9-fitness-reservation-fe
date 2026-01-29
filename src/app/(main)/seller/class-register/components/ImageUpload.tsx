import { RefObject } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  selectedImages: File[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageSelect: (file: File) => void;
  onImageRemove: (index: number) => void;
}

const MAX_IMAGES = 3;

export function ImageUpload({
  selectedImages,
  fileInputRef,
  onImageSelect,
  onImageRemove,
}: ImageUploadProps) {
  const canAddMore = selectedImages.length < MAX_IMAGES;

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
                  onImageSelect(file);

                  e.target.value = '';
                }
              }}
            />
          </>
        )}
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
