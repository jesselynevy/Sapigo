export interface Sapi {
  id: string;
  nama: string;
  umur: number;
  berat: number;
  harga: number;
  status: "tersedia" | "ditawar" | "terjual" | "pending";
  deskripsi: string;
  foto?: string;
  peternakId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SapiFilter {
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
}

export interface CowData {
  cowCode: string;
  ownerId: string;
  display_name: string;
  breed: string;
  sex: string;
  weight: number | null;
  status: string;
  verification: "verified" | "unverified";
}
