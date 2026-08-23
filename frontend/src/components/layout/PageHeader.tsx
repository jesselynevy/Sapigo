"use client";

import Link from "next/link";

interface PageHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  showBackButton = true,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        {showBackButton && (
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ←
          </Link>
        )}
        {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
      </div>
    </div>
  );
}
