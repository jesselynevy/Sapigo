"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <img
        className="pointer-events-none absolute top-[5vh]"
        src="/sapigo.webp"
        alt=""
      />

      <div className="flex absolute h-full justify-center flex-col gap-4 font-jakarta  w-full items-center ">
        <h1 className="font-bold text-5xl text-center">Welcome to Sapigo</h1>
        <h2 className="font-bold text-2xl">Moo-percaya, moo-verifikasi</h2>
      </div>

      <div className="container absolute bottom-0 z-10 mx-auto flex h-fit flex-col items-center gap-4 self-end rounded-t-[40px] bg-white px-4 py-6">
        <Link
          href="/login"
          className="w-full cursor-pointer rounded-full bg-primary px-8 py-3 text-center font-medium text-white transition-colors hover:bg-orange-700"
        >
          Masuk
        </Link>

      </div>
    </div>
  );
}
