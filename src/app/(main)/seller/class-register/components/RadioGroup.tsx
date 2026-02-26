import {
  Control,
  useWatch,
  UseFormSetValue,
  UseFormTrigger,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

interface RadioGroupProps<T extends FieldValues> {
  label: string;
  name: FieldPath<T>;
  options: readonly string[];
  optionLabels?: Record<string, string>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  error?: string;
  required?: boolean;
  allowDeselect?: boolean;
}

export function RadioGroup<T extends FieldValues>({
  label,
  name,
  options,
  optionLabels,
  control,
  setValue,
  trigger,
  error,
  required = true,
  allowDeselect = true,
}: RadioGroupProps<T>) {
  const selectedValue = useWatch({ control, name });

  const handleClick = async (value: string) => {
    if (selectedValue === value) {
      if (allowDeselect) {
        setValue(name, '' as T[FieldPath<T>]);
      } else {
        // 선택 해제하지 않음 (항상 하나는 선택되어야 함)
        return;
      }
    } else {
      setValue(name, value as T[FieldPath<T>]);
    }
    // 유효성 검사 트리거
    await trigger(name);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-800">
        {label} {required && <span className="text-blue-500">*</span>}
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isChecked = selectedValue === opt;
          const displayLabel = optionLabels?.[opt] || opt;
          return (
            <label key={opt} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                value={opt}
                checked={isChecked}
                onChange={() => {}}
                onClick={() => handleClick(opt)}
                className="sr-only"
              />
              <div
                className={`relative flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                  isChecked ? 'bg-blue-600' : 'border-[5.5px] border-gray-300 bg-white'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <span className="text-base text-gray-700">{displayLabel}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
