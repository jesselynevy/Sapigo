"use client";

import Link from "next/link";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation"; // bukan "next/router"

export default function Home() {
  const router = useRouter();

  return (
    <div className=" relative min-h-screen">
      <img className="absolute top-[5vh]" src="/sapigo.webp" />

      <div className="flex absolute h-full justify-center flex-col gap-4 font-jakarta  w-full items-center ">
        <h1 className="font-bold text-5xl text-center">Welcome to Sapigo</h1>
        <h2 className="font-bold text-2xl">Moo-percaya, moo-verifikasi</h2>
      </div>

      <div className="container mx-auto flex bg-white py-8 px-4 gap-4  absolute bottom-0 self-end flex-col  rounded-t-[40px] items-center h-[25vh] ">
        <Button
          variant="primary"
          onClick={() => {
            router.push("/login");
          }}
          className="w-full"
        >
          Masuk
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            router.push("/register");
          }}
          className="w-full"
        >
          Daftar
        </Button>
      </div>
    </div>
  );
}
