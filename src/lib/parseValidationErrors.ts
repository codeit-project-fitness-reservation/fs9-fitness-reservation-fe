export function parseValidationErrors(details: string): Record<string, string> {
  const errorMap: Record<string, string> = {};
  if (!details) return errorMap;

  // 백엔드 검증 오류 형식 예:
  // "body.email: 올바른 이메일 형식이어야 합니다, body.password: 비밀번호는 8자 이상이어야 합니다"
  const errors = details.split(', ');
  errors.forEach((error) => {
    const [path, ...messageParts] = error.split(': ');
    if (path && messageParts.length > 0) {
      const fieldName = path.replace('body.', '');
      errorMap[fieldName] = messageParts.join(': ');
    }
  });

  return errorMap;
}
