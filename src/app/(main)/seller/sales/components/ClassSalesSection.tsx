'use client';

import Image from 'next/image';

interface ClassSales {
  id: string;
  title: string;
  revenue: number;
  imgUrl?: string;
}

interface ClassSalesSectionProps {
  classSales: ClassSales[];
}

export default function ClassSalesSection({ classSales }: ClassSalesSectionProps) {
  const formatCurrency = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${amount.toLocaleString('ko-KR')}원`;
  };

  return (
    <section className="mb-6">
      <h2 className="mb-3 text-base font-semibold text-gray-900">클래스별 매출</h2>
      {classSales.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">매출 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {classSales.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              {item.imgUrl ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={item.imgUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <span className="text-xs text-gray-400">No Image</span>
                </div>
              )}

              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="truncate text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-sm font-semibold text-gray-950">
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
