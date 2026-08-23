"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Bell, History, LogOut, Plus, Scan } from "lucide-react";

import CowCard from "@/src/components/home/CowCard";
import QuickAction from "@/src/components/home/QuickAction";
import SectionHeader from "@/src/components/home/SectionHeader";
import StatCard from "@/src/components/home/StatCard";
import { getCurrentUser, logout } from "@/src/lib/api/auth";
import { listAnimals } from "@/src/lib/api/sapi";
import { CowData } from "@/src/types/sapi";

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
}

export default function HomePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState<string | null>(null);
  const [cows, setCows] = useState<CowData[]>([]);
  const [loadingCows, setLoadingCows] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAndAnimals = async () => {
      try {
        const user = await getCurrentUser();
        setFullName(user.full_name);
        const animals = await listAnimals(user.id);
        setCows(animals);
      } catch {
        setCows([]);
      } finally {
        setLoadingCows(false);
      }
    };

    void loadUserAndAnimals();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Tidak dapat keluar. Silakan coba lagi.",
      );
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-primary">
      <div className="px-8 pt-6 pb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {fullName ? (
              <div
                aria-label={`Avatar ${fullName}`}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 font-jakarta text-lg font-bold text-white"
              >
                {getInitials(fullName)}
              </div>
            ) : (
              <div
                aria-label="Memuat avatar pengguna"
                className="h-14 w-14 animate-pulse rounded-full bg-white/30"
              />
            )}
            <div>
              {fullName ? (
                <p className="text-white font-jakarta font-bold text-lg">
                  {fullName}
                </p>
              ) : (
                <div
                  aria-label="Memuat nama pengguna"
                  className="h-6 w-28 animate-pulse rounded bg-white/30"
                />
              )}
              <p className="text-white/70 text-sm">Reseller</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/notifikasi")}
              className="relative cursor-pointer"
              aria-label="Notifikasi"
            >
              <Bell className="text-white w-8 h-8" />
              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="flex items-center gap-1 rounded-full border border-white/50 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </div>

        {logoutError && <p className="text-sm text-red-200">{logoutError}</p>}

        <div className="flex gap-3">
          <StatCard value={loadingCows ? "—" : cows.length} label="Registered Cows" />
          <StatCard value="—" label="Sold This Month" />
          <StatCard value="—" label="Pending Verification" />
        </div>
      </div>

      <div className="bg-white rounded-t-[40px] flex-1 px-6 py-8 flex flex-col gap-5">
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

        <div className="flex flex-col gap-2">
          <SectionHeader
            title="Your Cows"
            onSeeAll={() => router.push("/sapi-anda")}
          />
          {loadingCows ? (
            <p className="text-sm text-gray-400">Loading cows...</p>
          ) : cows.length === 0 ? (
            <p className="text-sm text-gray-400">No cows registered yet.</p>
          ) : (
            cows.slice(0, 2).map((cow) => (
              <CowCard
                key={cow.cowCode}
                name={cow.display_name}
                subtitle={`ID: ${cow.cowCode}`}
                status="unverified"
              />
            ))
          )}
        </div>

        <div className="flex flex-col gap-2">
          <SectionHeader
            title="Recent Activity"
            onSeeAll={() => router.push("/aktivitas")}
          />
          <p className="text-sm text-gray-400">
            Activity history is not available from the backend yet.
          </p>
        </div>
      </div>
    </div>
  );
}
