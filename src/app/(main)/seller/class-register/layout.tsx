import SimpleHeader from '@/components/layout/SimpleHeader';

interface ItemsLayoutProps {
  children: React.ReactNode;
}

export default function ItemsLayout({ children }: ItemsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SimpleHeader title="새 클래스 등록" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
