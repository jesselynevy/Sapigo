"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, History, LogOut, Plus, Scan } from "lucide-react";

import CowCard from "@/src/components/home/CowCard";
import ActivityCard from "@/src/components/home/ActivityCard";
import QuickAction from "@/src/components/home/QuickAction";
import SectionHeader from "@/src/components/home/SectionHeader";
import StatCard from "@/src/components/home/StatCard";
import { getCurrentUser, logout } from "@/src/lib/api/auth";
import { listAnimals } from "@/src/lib/api/sapi";
import { CowData } from "@/src/types/sapi";
import { getCowActivities } from "@/src/lib/utils/cowActivity";

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
        const animals = await listAnimals(user.id, true);
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

  const activeCows = cows
    .filter((cow) => !cow.transferredAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentActivities = getCowActivities(cows).slice(0, 3);
  const now = new Date();
  const soldThisMonth = cows.filter((cow) => {
    if (!cow.transferredAt) return false;
    const transferredAt = new Date(cow.transferredAt);
    return transferredAt.getFullYear() === now.getFullYear()
      && transferredAt.getMonth() === now.getMonth();
  }).length;
  const pendingVerification = activeCows.filter(
    (cow) => cow.verification === "pending",
  ).length;

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
          <StatCard value={loadingCows ? "—" : activeCows.length} label="Registered Cows" />
          <StatCard value={loadingCows ? "—" : soldThisMonth} label="Sold This Month" />
          <StatCard value={loadingCows ? "—" : pendingVerification} label="Pending Verification" />
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
          ) : activeCows.length === 0 ? (
            <p className="text-sm text-gray-400">No cows registered yet.</p>
          ) : (
            activeCows.slice(0, 2).map((cow) => (
              <CowCard
                key={cow.cowCode}
                name={cow.display_name}
                subtitle={`ID: ${cow.cowCode}`}
                status={cow.verification}
              />
            ))
          )}
        </div>

        <div className="flex flex-col gap-2">
          <SectionHeader
            title="Recent Activity"
            onSeeAll={() => router.push("/riwayat")}
          />
          {loadingCows ? (
            <p className="text-sm text-gray-400">Loading activity...</p>
          ) : recentActivities.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet.</p>
          ) : (
            recentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={`${activity.type}: ${activity.cow.display_name}`}
                subtitle={`${new Date(activity.date).toLocaleDateString()} · ID: ${activity.cow.cowCode}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
