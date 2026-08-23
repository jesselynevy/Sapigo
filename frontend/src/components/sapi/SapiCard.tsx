"use client";

import Card from "../ui/Card";
import SapiStatusBadge from "./SapiStatusBadge";

interface Sapi {
  id: string;
  nama: string;
  umur: number;
  berat: number;
  status: "tersedia" | "ditawar" | "terjual" | "pending";
  harga: number;
}

interface SapiCardProps {
  sapi: Sapi;
  onClick?: () => void;
}

export default function SapiCard({ sapi, onClick }: SapiCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      // onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{sapi.nama}</h3>
          <p className="text-sm text-gray-600">ID: {sapi.id}</p>
        </div>
        <SapiStatusBadge status={sapi.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600">Umur</p>
          <p className="text-lg font-semibold text-gray-900">
            {sapi.umur} bulan
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Berat</p>
          <p className="text-lg font-semibold text-gray-900">{sapi.berat} kg</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">Harga</p>
        <p className="text-2xl font-bold text-orange-600">
          Rp {sapi.harga.toLocaleString("id-ID")}
        </p>
      </div>
    </Card>
  );
}
