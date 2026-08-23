import { ReactNode } from "react";

export default function AuthScreenLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-start justify-center bg-primary px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mt-4 font-jakarta text-3xl font-bold text-white">
        {title}
      </h1>
      {children}
    </div>
  );
}
