'use client';

import StatusBadge from '@/components/common/StatusBadge';
import { SalesTransaction } from '@/types';
import { formatCurrency } from '@/lib/utils/format';

interface TransactionListProps {
  transactions: SalesTransaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-gray-900">거래 내역</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">거래 내역이 없습니다.</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b border-gray-100 p-4 last:border-b-0"
            >
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {transaction.className}
                  </span>
                  <StatusBadge
                    status={transaction.status === 'BOOKED' ? 'COMPLETED' : 'REFUNDED'}
                    label={transaction.statusLabel}
                  />
                </div>
                <p className="text-xs text-gray-400">{transaction.dateTime}</p>
              </div>
              <p
                className={`text-sm font-semibold ${transaction.amount >= 0 ? 'text-blue-600' : 'text-gray-400'}`}
              >
                {formatCurrency(transaction.amount, { showSign: true })}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
