export const locale = "id-ID";
export type AppLocale = "id" | "en";

const LOCALE_STORAGE_KEY = "sapigo-locale";

export function getAppLocale(): AppLocale {
  if (typeof window === "undefined") return "id";
  return window.localStorage.getItem(LOCALE_STORAGE_KEY) === "en" ? "en" : "id";
}

export function setAppLocale(nextLocale: AppLocale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
}

// Keep interface copy in one place. The keys are the existing source strings so
// components that receive API/error text can be localized as well.
const messages: Record<string, string> = {
  "Loading...": "Memuat...",
  "Loading cow...": "Memuat data sapi...",
  "Loading cows...": "Memuat data sapi...",
  "Loading your cows...": "Memuat sapi Anda...",
  "Loading activity...": "Memuat aktivitas...",
  "Loading history...": "Memuat riwayat...",
  "Cow Verification": "Verifikasi Sapi",
  "Cow Information": "Informasi Sapi",
  "Cow Code": "Kode Sapi",
  "Cow Name": "Nama Sapi",
  "Cow identity verified": "Identitas sapi terverifikasi",
  "Cow identity does not match": "Identitas sapi tidak cocok",
  "Select your cow": "Pilih sapi Anda",
  "Select the cow to transfer": "Pilih sapi yang akan ditransfer",
  "Choose another cow": "Pilih sapi lain",
  "Choose image file": "Pilih file gambar",
  "Use camera": "Gunakan kamera",
  "Retake with camera": "Ambil ulang dengan kamera",
  "Retake photo": "Ambil ulang foto",
  "Muzzle photo": "Foto moncong sapi",
  "Please point your camera towards the muzzle of the cow.": "Arahkan kamera ke moncong sapi.",
  "Please check if it's the correct cow.": "Pastikan ini sapi yang benar.",
  "Choose the cow in your inventory, then photograph or upload its muzzle.": "Pilih sapi dari inventaris Anda, lalu foto atau unggah foto moncongnya.",
  "Take or upload a clear photo of this cow's muzzle.": "Ambil atau unggah foto moncong sapi ini yang jelas.",
  "Take or upload a clear muzzle photo before recording this cow-out.": "Ambil atau unggah foto moncong yang jelas sebelum mencatat sapi keluar ini.",
  "These details are saved to the backend before photos are collected.": "Detail ini disimpan ke sistem sebelum foto dikumpulkan.",
  "Confirm the details stored in the database.": "Konfirmasi detail yang tersimpan di database.",
  "Take these in order: middle, left, then right. Keep the muzzle centered, sharp, and well lit.": "Ambil foto secara berurutan: tengah, kiri, lalu kanan. Pastikan moncong berada di tengah, tajam, dan cukup cahaya.",
  "1. Middle — face the muzzle straight on": "1. Tengah — hadapkan moncong lurus ke kamera",
  "2. Left — photograph the left side of the muzzle": "2. Kiri — foto sisi kiri moncong",
  "3. Right — photograph the right side of the muzzle": "3. Kanan — foto sisi kanan moncong",
  "Sign in as a reseller to save this cow under your ownership.": "Masuk sebagai reseller untuk menyimpan sapi ini dalam kepemilikan Anda.",
  "Sign in as a reseller before registering a cow.": "Masuk sebagai reseller sebelum mendaftarkan sapi.",
  "Sign in as a reseller to transfer a cow.": "Masuk sebagai reseller untuk mentransfer sapi.",
  "Sign in as a reseller to verify one of your cows.": "Masuk sebagai reseller untuk memverifikasi salah satu sapi Anda.",
  "Sign in as a reseller to see your cows.": "Masuk sebagai reseller untuk melihat sapi Anda.",
  "Could not load your cows.": "Tidak dapat memuat sapi Anda.",
  "Could not load cows from the backend.": "Tidak dapat memuat data sapi dari sistem.",
  "Could not copy the public verification link.": "Tidak dapat menyalin tautan verifikasi publik.",
  "The request could not be completed.": "Permintaan tidak dapat diselesaikan.",
  "Transfer could not be completed.": "Transfer tidak dapat diselesaikan.",
  "Transfer result is unavailable.": "Hasil transfer tidak tersedia.",
  "Verification failed. Please try again.": "Verifikasi gagal. Silakan coba lagi.",
  "Failed to fetch cow data.": "Gagal mengambil data sapi.",
  "This cow has no enrolled muzzle template yet.": "Sapi ini belum memiliki template moncong yang terdaftar.",
  "This public verification link is invalid.": "Tautan verifikasi publik ini tidak valid.",
  "Cow not found or this link is no longer valid.": "Sapi tidak ditemukan atau tautan ini sudah tidak berlaku.",
  "No muzzle photo is available. Go back and take or upload one.": "Foto moncong belum tersedia. Kembali dan ambil atau unggah foto.",
  "Enrollment result is unavailable. Please try again.": "Hasil pendaftaran tidak tersedia. Silakan coba lagi.",
  "now": "sekarang",
  "Breed": "Ras",
  "Sex": "Jenis kelamin",
  "Weight": "Berat",
  "Ownership": "Kepemilikan",
  "Verification": "Verifikasi",
  "Registered": "Terdaftar",
  "Registered at": "Terdaftar pada",
  "Registered owner": "Pemilik terdaftar",
  "Registered Cows": "Sapi Terdaftar",
  "Register a Cow": "Daftarkan Sapi",
  "Register Cow": "Daftarkan Sapi",
  "Transfer a Cow": "Transfer Sapi",
  "Transfer Cow": "Transfer Sapi",
  "Transfer History": "Riwayat Transfer",
  "Your Cows": "Sapi Anda",
  "My Cows": "Sapi Saya",
  "Recent Activity": "Aktivitas Terkini",
  "Activity": "Aktivitas",
  "Status": "Status",
  "Sold This Month": "Terjual Bulan Ini",
  "Pending Verification": "Menunggu Verifikasi",
  "Pending": "Menunggu",
  "Verified": "Terverifikasi",
  "Verification Mismatch": "Verifikasi Tidak Cocok",
  "Continue": "Lanjutkan",
  "Finish": "Selesai",
  "Back": "Kembali",
  "Recipient details": "Detail penerima",
  "Recipient phone number": "Nomor telepon penerima",
  "Verify the cow's muzzle": "Verifikasi moncong sapi",
  "Verifying...": "Memverifikasi...",
  "Verify again": "Verifikasi lagi",
  "Verify muzzle": "Verifikasi moncong sapi",
  "Verifying muzzle with AI...": "Memverifikasi moncong sapi dengan AI...",
  "No cows registered yet.": "Belum ada sapi yang terdaftar.",
  "No activity yet.": "Belum ada aktivitas.",
  "No transferable cows available.": "Tidak ada sapi yang dapat ditransfer.",
  "There is no history.": "Belum ada riwayat.",
  "Not available": "Tidak tersedia",
  "Not recorded": "Belum dicatat",
  "Breed not recorded": "Ras belum dicatat",
  "Weight not recorded": "Berat belum dicatat",
  "Owner information unavailable": "Informasi pemilik tidak tersedia",
  "View Details": "Lihat Detail",
  "Link copied": "Tautan disalin",
  "Create public verification link": "Buat tautan verifikasi publik",
  "Create animal": "Buat data sapi",
  "Animal created": "Data sapi dibuat",
  "Animal ID": "ID Sapi",
  "Name": "Nama",
  "Weight (kg)": "Berat (kg)",
  "Select Female or Male": "Pilih Betina atau Jantan",
  "Female (F)": "Betina (F)",
  "Male (M)": "Jantan (M)",
  "Upload & enroll": "Unggah & daftarkan",
  "Capture reference photos": "Ambil foto referensi",
  "Summary of Cow Information": "Ringkasan Informasi Sapi",
  "Biometric Identity of Cow Verification": "Verifikasi Identitas Biometrik Sapi",
  "See all": "Lihat semua",
  "preview": "pratinjau",
  "Input Field foto biasa": "Unggah foto",
};

export function translate(value: string): string {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const text = value.trim();
  const translated = messages[text] ?? translatePattern(text);
  return `${leading}${translated}${trailing}`;
}

function translatePattern(text: string): string {
  const patterns: Array<[RegExp, string]> = [
    [/^Photo rejected: (.+)$/, "Foto ditolak: $1"],
    [/^Similarity score: (.+)$/, "Skor kemiripan: $1"],
    [/^Transferred at (.+)\.$/, "Ditransfer pada $1."],
    [/^(.+) is confirmed as cow-out\.$/, "$1 dikonfirmasi telah keluar."],
    [/^No cow-out was recorded\. Similarity score: (.+)$/, "Tidak ada sapi keluar yang dicatat. Skor kemiripan: $1"],
    [/^ID: (.+)$/, "ID: $1"],
    [/^Registered: (.+)$/, "Terdaftar: $1"],
    [/^(.+)'s muzzle template is enrolled\.$/, "Template moncong $1 telah terdaftar."],
    [/^Cow-in recorded\. You can now verify or transfer this cow using a live muzzle photo\.$/, "Sapi masuk telah dicatat. Anda kini dapat memverifikasi atau mentransfer sapi ini menggunakan foto moncong langsung."],
    [/^Cow (.+)'s identity is verified!$/, "Identitas sapi $1 terverifikasi!"],
    [/^Cow (.+)'s identity does not match\.$/, "Identitas sapi $1 tidak cocok."],
  ];

  for (const [pattern, replacement] of patterns) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  return text;
}
