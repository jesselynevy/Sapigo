"use client";

interface Aktivitas {
  id: string;
  deskripsi: string;
  waktu: string;
  status: "success" | "info" | "warning";
}

interface AktivitasListProps {
  aktivitas: Aktivitas[];
}

export default function AktivitasList({ aktivitas }: AktivitasListProps) {
  return (
    <div className="space-y-3">
      {aktivitas.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 border-l-4 border-orange-600 pl-4"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {item.deskripsi}
            </p>
            <p className="text-xs text-gray-500">{item.waktu}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              item.status === "success"
                ? "bg-green-100 text-green-800"
                : item.status === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}
