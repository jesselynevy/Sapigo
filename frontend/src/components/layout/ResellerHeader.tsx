"use client";

import Link from "next/link";

export default function ResellerHeader() {
  return (
    <header className="bg-orange-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SapiGo</h1>
          <p className="text-sm text-orange-100">Reseller</p>
        </div>
        <nav className="flex gap-6">
          <Link href="/transfer-sapi" className="hover:text-orange-100">
            Transfer
          </Link>
          <Link href="/daftar-sapi" className="hover:text-orange-100">
            Daftar Sapi
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
