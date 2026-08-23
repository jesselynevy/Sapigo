"use client";

import { Bell, Plus, History, ArrowLeftRight, Scan } from "lucide-react";
import StatCard from "@/src/components/home/StatCard";
import QuickAction from "@/src/components/home/QuickAction";
import CowCard from "@/src/components/home/CowCard";
import ActivityCard from "@/src/components/home/ActivityCard";
import SectionHeader from "@/src/components/home/SectionHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listAnimals } from "@/src/lib/api/sapi";
import { CowData } from "@/src/types/sapi";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function HomePage() {
  const router = useRouter();
  const [cows, setCows] = useState<CowData[]>([]);
  const [loadingCows, setLoadingCows] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.id) {
      setCows([]);
      setLoadingCows(false);
      return;
    }
    listAnimals(user.id)
      .then(setCows)
      .catch(() => setCows([]))
      .finally(() => setLoadingCows(false));
  }, [user?.id]);

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
          <StatCard value={loadingCows ? "—" : cows.length} label="Registered Cows" />
          <StatCard value="—" label="Sold This Month" />
          <StatCard value="—" label="Pending Verification" />
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
          <QuickAction
            onClick={() => router.push("/verification")}
            icon={<Scan />}
            label="Cow Verification"
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
          {loadingCows ? (
            <p className="text-sm text-gray-400">Loading cows...</p>
          ) : cows.length === 0 ? (
            <p className="text-sm text-gray-400">No cows registered yet.</p>
          ) : (
            cows.slice(0, 2).map((cow) => (
              <CowCard key={cow.cowCode} name={cow.display_name} subtitle={`ID: ${cow.cowCode}`} status="unverified" />
            ))
          )}
        </div>

        {/* recent activity */}
        <div className="flex flex-col gap-2">
          <SectionHeader
            title="Recent Activity"
            onSeeAll={() => {
              router.push("/aktivitas");
            }}
          />
          <p className="text-sm text-gray-400">Activity history is not available from the backend yet.</p>
        </div>
      </div>
    </div>
  );
}
