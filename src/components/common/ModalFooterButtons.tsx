'use client';

interface ModalFooterButtonsProps {
  cancelLabel?: string;
  submitLabel: string;
  submitLoadingLabel?: string;
  onCancel: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  className?: string;
}

export default function ModalFooterButtons({
  cancelLabel = '취소',
  submitLabel,
  submitLoadingLabel,
  onCancel,
  onSubmit,
  isSubmitting = false,
  isValid = true,
  className = '',
}: ModalFooterButtonsProps) {
  const isDisabled = isSubmitting || !isValid;
  const displayLabel = isSubmitting && submitLoadingLabel ? submitLoadingLabel : submitLabel;

  return (
    <div className={`mt-6 flex gap-3 md:mt-[48px] ${className}`}>
      <button
        type="button"
        onClick={onCancel}
        className="h-12 flex-1 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {cancelLabel}
      </button>
      <button
        type={onSubmit ? 'button' : 'submit'}
        onClick={onSubmit}
        disabled={isDisabled}
        className={`h-12 flex-1 rounded-lg text-sm font-semibold transition-all ${
          isDisabled
            ? 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {displayLabel}
      </button>
    </div>
  );
}
