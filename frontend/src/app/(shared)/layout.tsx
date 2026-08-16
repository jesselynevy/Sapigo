import PageHeader from "@/components/layout/PageHeader";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}
