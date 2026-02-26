import AdminSidebar from './_components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-5">{children}</main>
    </div>
  );
}
