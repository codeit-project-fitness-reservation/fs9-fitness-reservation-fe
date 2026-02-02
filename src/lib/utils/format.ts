// 숫자를 한국 통화 형식
export const formatCurrency = (
  amount: number,
  options?: {
    showSign?: boolean;
    unit?: string;
  },
): string => {
  const { showSign = false, unit = '원' } = options || {};
  const sign = showSign && amount >= 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('ko-KR')}${unit}`;
};

// 숫자를 콤마가 포함
export const formatWithCommas = (value: number | string): string => {
  if (!value) return '';
  const num = typeof value === 'string' ? Number(value.replace(/[^0-9]/g, '')) : value;
  return num.toLocaleString('ko-KR');
};
