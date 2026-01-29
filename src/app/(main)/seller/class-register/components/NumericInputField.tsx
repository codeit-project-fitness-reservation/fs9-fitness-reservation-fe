import { Control, Controller } from 'react-hook-form';
import InputField from '@/components/Field/InputField';
import { ClassFormInput, NumericFieldConfig } from '../classschema';

const formatWithCommas = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === '') return '';

  const pureNumber = value.toString().replace(/[^0-9]/g, '');
  return pureNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

interface NumericInputFieldProps {
  field: NumericFieldConfig;
  control: Control<ClassFormInput>;
}

export function NumericInputField({ field, control }: NumericInputFieldProps) {
  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: { onChange, onBlur, value, ref, name }, fieldState }) => {
        const displayValue = formatWithCommas(value);

        return (
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-800">
              {field.label} <span className="text-blue-500">*</span>
            </label>
            <div className="relative">
              <InputField
                ref={ref}
                name={name}
                value={displayValue}
                onChange={(event) => {
                  const onlyNumber = event.target.value.replace(/[^0-9]/g, '');
                  onChange(onlyNumber);
                }}
                onBlur={onBlur}
                placeholder={field.placeholder}
                className="pr-10"
                inputMode="numeric"
                error={fieldState.error?.message}
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-base font-medium text-gray-700">
                {field.unit}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
