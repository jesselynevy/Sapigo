import CompletedProfileGate from "@/src/components/auth/CompletedProfileGate";

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompletedProfileGate>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto ">{children}</main>
      </div>
    </CompletedProfileGate>
  );
}
