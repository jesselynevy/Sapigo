"use client";

export default function PermintaanKonfirmasi() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Konfirmasi Permintaan
      </h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">
          Tidak ada permintaan yang menunggu konfirmasi
        </p>
      </div>
    </div>
  );
}
