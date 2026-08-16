import PeternakHeader from "@/components/layout/PeternakHeader";

export default function PeternakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PeternakHeader />
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}
