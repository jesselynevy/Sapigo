"use client";

import Link from "next/link";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation"; // bukan "next/router"

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto flex bg-white py-8 px-4 gap-4  absolute bottom-0 self-end flex-col  rounded-t-[40px] items-center h-[35vh] ">
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
