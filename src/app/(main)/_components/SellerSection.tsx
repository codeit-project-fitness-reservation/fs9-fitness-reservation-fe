'use client';

import Link from 'next/link';
import Image from 'next/image';
import RoleSwitcher from './RoleSwitcher';
import Footer from '@/app/(main)/(customer)/main/_components/Footer';
import imgRectangle2 from '@/assets/images/Rectangle 2.svg';
import imgRectangle3 from '@/assets/images/Rectangle 3.svg';
import imgRectangle4 from '@/assets/images/Rectangle 4.svg';
import imgFlamelEdit from '@/assets/images/Flamel-ai-edit-2432131 1.svg';
import imgFlamel3D1 from '@/assets/images/flamel-ai-collection-FLAMEL-3D-1923925 2.svg';
import imgFlamel3D2 from '@/assets/images/flamel-ai-collection-FLAMEL-3D-591205 1.svg';
import imgCheck from '@/assets/images/check.svg';
import imgChevronRight from '@/assets/images/chevron-right.svg';
import imgStar6 from '@/assets/images/Star 6.svg';

type TabType = 'customer' | 'seller';

interface SellerSectionProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function SellerSection({ activeTab, setActiveTab }: SellerSectionProps) {
  return (
    <div className="flex w-full flex-col">
      {/* Section 1: Class Management */}
      <div className="relative min-h-[567px] overflow-hidden bg-gray-50 md:h-[560px]">
        <div className="mx-auto flex h-full w-full max-w-[1040px] flex-col px-8 pt-6 md:px-[100px]">
          <div className="flex w-full flex-col gap-[40px] md:gap-[56px]">
            <RoleSwitcher activeRole={activeTab} onRoleChange={setActiveTab} />

            <div className="flex w-full flex-col items-start gap-[48px] md:flex-row md:items-center md:justify-between">
              <div className="mx-auto flex w-full max-w-[311px] flex-col gap-[16px] md:mx-0 md:max-w-none md:flex-1 md:gap-[30px]">
                <h2 className="text-left text-xl leading-[30px] font-bold whitespace-pre-wrap text-gray-800 md:text-[30px] md:leading-[38px]">
                  번거로운 전화 예약,
                  <br />
                  불편하지 않으셨나요?
                </h2>
                <div className="flex items-center gap-[6px] md:gap-2">
                  {/* 체크 아이콘 배경 서클 추가 */}
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 md:h-6 md:w-6">
                    <Image src={imgCheck} alt="" width={12} height={12} className="md:h-4 md:w-4" />
                  </div>
                  <p className="text-sm font-medium text-blue-700 md:text-base">
                    쉽고 빠른 클래스 관리
                  </p>
                </div>
              </div>

              <div className="relative h-[255px] w-full max-w-[311px] shrink-0 self-center rounded-[18px] border border-gray-200 bg-gray-100 md:h-[340px] md:max-w-[416px] md:translate-x-16 md:self-auto md:rounded-[24px]">
                <div className="absolute top-[calc(50%+25px)] left-1/2 h-[387px] w-[192px] -translate-x-1/2 -translate-y-1/2 md:top-[calc(50%+35px)] md:h-[516px] md:w-[256px]">
                  <Image src={imgRectangle2} alt="" fill className="object-contain" />
                </div>
                {/* 손가락 아이콘: max-none 추가 */}
                <div className="absolute top-[45%] left-[75%] flex">
                  <Image
                    src={imgFlamelEdit}
                    alt=""
                    width={136}
                    height={136}
                    className="h-[100px] w-[100px] max-w-none md:h-[136px] md:w-[136px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Schedule Management (데스크톱 폰 왼쪽 / 텍스트 오른쪽 우측정렬) */}
      <div className="relative flex min-h-[503px] items-center overflow-hidden bg-blue-400 py-12 md:h-[524px] md:py-0">
        <div className="mx-auto flex h-full w-full max-w-[1040px] flex-col items-end gap-[48px] px-8 md:flex-row-reverse md:items-center md:justify-between md:px-[100px]">
          <div className="order-1 mx-auto flex w-full max-w-[311px] flex-col items-end gap-[16px] md:mx-0 md:max-w-none md:flex-1 md:gap-[30px]">
            <h2 className="text-right text-xl leading-[30px] font-bold text-white md:text-[30px] md:leading-[38px]">
              스케줄을 한 눈에
              <br />
              확인해보세요!
            </h2>
            <div className="flex items-center gap-[6px]">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50/20 md:h-6 md:w-6">
                <Image
                  src={imgCheck}
                  alt=""
                  width={12}
                  height={12}
                  className="brightness-0 invert md:h-4 md:w-4"
                />
              </div>
              <p className="text-sm font-medium text-blue-50 md:text-base">간편한 주간 스케줄</p>
            </div>
          </div>

          <div className="relative order-2 h-[255px] w-full max-w-[311px] shrink-0 self-center rounded-[18px] bg-blue-300 md:h-[340px] md:max-w-[416px] md:-translate-x-16 md:self-auto md:rounded-[24px]">
            <div className="absolute top-[calc(50%+25px)] left-1/2 h-[387px] w-[192px] -translate-x-1/2 -translate-y-1/2 md:top-[calc(50%+35px)] md:h-[516px] md:w-[256px]">
              <Image src={imgRectangle3} alt="" fill className="object-contain" />
            </div>
            {/* 캘린더 아이콘: 폰 이미지 오른쪽 아래 */}
            <div className="absolute right-0 bottom-0 flex translate-x-1/4 translate-y-1/4 opacity-80">
              <Image
                src={imgFlamel3D1}
                alt=""
                width={120}
                height={120}
                className="max-w-none md:h-[182px] md:w-[182px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Sales Settlement */}
      <div className="relative overflow-hidden bg-white pt-12 pb-[64px] md:pt-[92px] md:pb-[64px]">
        <div className="relative z-20 mx-auto max-w-[1040px] px-8 md:px-[100px]">
          <div className="flex flex-col items-start gap-[48px] md:flex-row md:items-center md:justify-between">
            <div className="mx-auto flex w-full max-w-[311px] flex-col gap-[16px] md:mx-0 md:max-w-none md:flex-1 md:gap-[30px]">
              <h2 className="text-left text-xl leading-[30px] font-bold text-gray-800 md:text-[30px] md:leading-[38px]">
                귀찮은 매출 정산,
                <br />
                이제 신경 쓸 필요 없어요
              </h2>
              <div className="flex items-center gap-[6px]">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 md:h-6 md:w-6">
                  <Image src={imgCheck} alt="" width={12} height={12} className="md:h-4 md:w-4" />
                </div>
                <p className="text-sm font-medium text-blue-700 md:text-base">손쉬운 매출 관리</p>
              </div>
            </div>

            <div className="relative h-[255px] w-[311px] shrink-0 self-center rounded-[18px] border border-gray-200 bg-gray-100 md:h-[340px] md:w-[416px] md:translate-x-16 md:self-auto md:rounded-[24px]">
              <div className="absolute top-[calc(50%+25px)] left-1/2 h-[387px] w-[192px] -translate-x-1/2 -translate-y-1/2 md:top-[calc(50%+35px)] md:h-[516px] md:w-[256px]">
                <Image src={imgRectangle4} alt="" fill className="object-contain" />
              </div>
              <div className="absolute -right-4 bottom-[-20px] flex md:bottom-[-35px]">
                <Image
                  src={imgFlamel3D2}
                  alt=""
                  width={100}
                  height={100}
                  className="max-w-none drop-shadow-lg md:h-[143px] md:w-[143px]"
                />
              </div>
            </div>
          </div>

          <div className="mt-[119px] flex justify-center">
            <Link href="/signup">
              <button className="flex h-[40px] items-center gap-1.5 rounded-[8px] bg-blue-500 px-[14px] py-[10px] text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-blue-600">
                <span>지금 시작하기</span>
                <Image src={imgChevronRight} alt="" width={16} height={16} />
              </button>
            </Link>
          </div>
        </div>

        {/* 배경 장식 요소: 왼쪽 하단 별 & 원 */}
        <div className="pointer-events-none absolute bottom-[100px] left-[5%] z-10 md:bottom-[100px] md:left-[90px]">
          <div className="relative">
            <Image
              src={imgStar6}
              alt=""
              width={24}
              height={22}
              className="absolute -bottom-4 -left-4 z-20 md:top-1/2 md:bottom-auto md:-left-12 md:-translate-y-1/2"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 145 145"
              fill="none"
              className="h-[67px] w-[67px] md:h-[145px] md:w-[145px]"
            >
              <circle
                opacity="0.5"
                cx="72.5"
                cy="72.5"
                r="72.5"
                fill="url(#paint0_linear_21240_14965)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_21240_14965"
                  x1="32.2222"
                  y1="-5.31871"
                  x2="117.611"
                  y2="142.579"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D8E8F7" />
                  <stop offset="1" stopColor="#DDEBFD" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 배경 타원 장식: 위치를 상향 조정(top-[250px])하여 다시 나타나게 함 */}
        <div className="pointer-events-none absolute top-[500px] right-[-120px] z-0 opacity-60 md:top-[400px] md:right-[-150px]">
          <svg
            viewBox="0 0 800 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-[450px] md:w-[800px]"
          >
            <g opacity="0.6">
              <ellipse
                cx="250"
                cy="350"
                rx="160"
                ry="300"
                fill="#D8E8F7"
                transform="rotate(42 250 350)"
              />
              <ellipse
                cx="450"
                cy="350"
                rx="160"
                ry="300"
                fill="#D8E8F7"
                transform="rotate(42 450 350)"
              />
            </g>
          </svg>
        </div>
      </div>

      <Footer />
    </div>
  );
}
