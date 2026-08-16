"use client";

import Link from "next/link";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation"; // bukan "next/router"

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto flex flex-col justify-between items-center">
        <h1 className="text-2xl font-bold text-black">SapiGo</h1>
        <div className="flex flex-col gap-4 w-full">
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
    </div>
  );
}
