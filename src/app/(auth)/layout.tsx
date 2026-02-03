export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <section className="flex min-h-dvh flex-col bg-white">{children}</section>;
}
