"use client";

interface BottomNavProps {
  items: Array<{
    label: string;
    href: string;
    icon?: string;
  }>;
}

export default function BottomNav({ items }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex-1 py-4 text-center text-sm font-medium text-gray-600 hover:text-orange-600"
          >
            {item.icon && <div className="text-lg">{item.icon}</div>}
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
