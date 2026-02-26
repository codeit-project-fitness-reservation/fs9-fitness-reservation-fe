# fs9-fitness-reservation-fe 세팅 스크립트
Write-Host "프론트엔드 세팅 시작..." -ForegroundColor Cyan

# 1. 의존성 설치
Write-Host "`n[1/2] pnpm install 실행 중..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) { exit 1 }

# 2. 환경 확인
Write-Host "`n[2/2] 환경 확인..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  .env 존재함 - NEXT_PUBLIC_API_URL 확인" -ForegroundColor Green
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "  .env 생성됨 (.env.example 기준)" -ForegroundColor Green
}

Write-Host "`n세팅 완료. 다음으로 실행:" -ForegroundColor Cyan
Write-Host "  pnpm dev   (개발 서버)" -ForegroundColor White
Write-Host "  pnpm build (빌드)" -ForegroundColor White
