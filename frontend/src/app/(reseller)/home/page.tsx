"use client";

import Image from "next/image";
import { Bell, Plus, History, ArrowLeftRight } from "lucide-react";
import StatCard from "@/src/components/home/StatCard";
import QuickAction from "@/src/components/home/QuickAction";
import CowCard from "@/src/components/home/CowCard";
import ActivityCard from "@/src/components/home/ActivityCard";
import SectionHeader from "@/src/components/home/SectionHeader";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col bg-primary">
      {/* header */}
      <div className="px-8 pt-6 pb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-300" />
            <div>
              <p className="text-white font-jakarta font-bold text-lg">
                John Doe
              </p>
              <p className="text-white/70 text-sm">Reseller</p>
            </div>
          </div>

          <button
            onClick={() => {
              router.push("/notifikasi");
            }}
            className="relative cursor-pointer"
          >
            <Bell className="text-white w-8 h-8" />
            <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        <div className="flex gap-3">
          <StatCard value={12} label="Registered Cows" />
          <StatCard value={2} label="Sold This Month" />
          <StatCard value={2} label="Pending Verification" />
        </div>
      </div>

      {/* white card content */}
      <div className="bg-white  rounded-t-[40px] flex-1 px-6 py-8 flex flex-col gap-5">
        {/* quick actions */}
        <div className="flex gap-7 justify-center">
          <QuickAction
            icon={<Plus />}
            label="Register Cow"
            onClick={() => router.push("/daftar-sapi/1")}
          />
          <QuickAction
            onClick={() => router.push("/transfer-sapi/1")}
            icon={<ArrowLeftRight />}
            label="Transfer Cow"
          />
          <QuickAction
            onClick={() => router.push("/riwayat")}
            icon={<History />}
            label="Transfer History"
          />
        </div>

        {/* your cows */}
        <div className="flex flex-col gap-2">
          <SectionHeader
            title="Your Cows"
            onSeeAll={() => {
              router.push("/sapi-anda");
            }}
          />
          <CowCard
            name="Cow ABCDE"
            subtitle="Reception info: when?"
            status="verified"
          />
          <CowCard
            name="Cow ABCDE"
            subtitle="Reception info: when?"
            status="unverified"
          />
        </div>

        {/* recent activity */}
        <div className="flex flex-col gap-2">
          <SectionHeader
            title="Recent Activity"
            onSeeAll={() => {
              router.push("/aktivitas");
            }}
          />
          <ActivityCard
            title="Cow ABCDE"
            subtitle="Successfully verified by buyer #ASDBSD"
          />
          <ActivityCard
            title="Cow ABCDE"
            subtitle="Successfully verified by buyer #ASDBSD"
          />
        </div>
      </div>
    </div>
  );
}
