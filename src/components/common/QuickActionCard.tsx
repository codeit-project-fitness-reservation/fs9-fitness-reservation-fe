'use client';

import Link from 'next/link';

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function QuickActionCard({
  icon,
  label,
  href,
  onClick,
  className = '',
}: QuickActionCardProps) {
  const cardStyles = `
    flex min-h-[7.25rem] w-full flex-col items-center justify-center gap-2.5 
    rounded-xl border border-gray-200 bg-white p-6 transition-all 
    hover:shadow-sm cursor-pointer
    ${className}
  `;

  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
        {icon}
      </div>
      <span className="text-center text-xs font-medium whitespace-nowrap text-gray-900">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardStyles} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cardStyles}>
      {content}
    </button>
  );
}
