import { Control, useWatch, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { ClassFormInput } from '../classschema';

interface RadioGroupProps {
  label: string;
  name: 'category' | 'level';
  options: readonly string[];
  control: Control<ClassFormInput>;
  setValue: UseFormSetValue<ClassFormInput>;
  trigger: UseFormTrigger<ClassFormInput>;
  error?: string;
}

export function RadioGroup({
  label,
  name,
  options,
  control,
  setValue,
  trigger,
  error,
}: RadioGroupProps) {
  const selectedValue = useWatch({ control, name });

  const handleClick = async (value: string) => {
    if (selectedValue === value) {
      setValue(name, '');
    } else {
      setValue(name, value as ClassFormInput[typeof name]);
    }
    // 유효성 검사 트리거
    await trigger(name);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-800">
        {label} <span className="text-blue-500">*</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isChecked = selectedValue === opt;
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
              <span className="text-base text-gray-700">{opt}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
