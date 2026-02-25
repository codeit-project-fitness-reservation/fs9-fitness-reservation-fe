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

// 전화번호 포맷팅 (010-1234-5678 형식)
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '';

  // 숫자만 추출
  const numbers = phone.replace(/[^0-9]/g, '');

  // 010-1234-5678 형식으로 변환
  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  }

  // 이미 포맷팅된 경우 그대로 반환
  if (phone.includes('-')) {
    return phone;
  }

  return phone;
};

// 전화번호 입력 시 자동 하이픈 추가
export const formatPhoneInput = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^0-9]/g, '');

  // 10~11자리 제한
  const limitedNumbers = numbers.slice(0, 11);

  // 하이픈 추가
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};
