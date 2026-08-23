"use client";

import Link from "next/link";

export default function PeternakHeader() {
  return (
    <header className="bg-orange-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SapiGo</h1>
          <p className="text-sm text-orange-100">Peternak</p>
        </div>
        <nav className="flex gap-6">
          <Link href="/request-sapi" className="hover:text-orange-100">
            Permintaan
          </Link>
          <Link href="/verifikasi" className="hover:text-orange-100">
            Verifikasi
          </Link>
          <Link href="/riwayat" className="hover:text-orange-100">
            Riwayat
          </Link>
          <Link href="/profil" className="hover:text-orange-100">
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
