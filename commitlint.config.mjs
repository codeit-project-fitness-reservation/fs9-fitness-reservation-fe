const Configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능 추가
        'fix', // 버그 수정
        'chore', // 설정 변경 (패키지 설치, 구조 변경 등)
        'style', // 코드 포맷팅 (Prettier 등)
        'refactor', // 코드 리팩토링
        'docs', // 문서 작업
        'test', // 테스트 추가
      ],
    ],
  },
};

export default Configuration;
