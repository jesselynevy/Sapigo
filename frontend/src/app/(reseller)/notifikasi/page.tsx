"use client";

import { useState } from "react";
import PageHeader from "@/src/components/ui/PageHeader";
import NotificationCard from "@/src/components/ui/NotificationCard";
import Button from "@/src/components/ui/Button";

interface Notification {
  id: string;
  type: "pending" | "verified" | "info";
  title: string;
  message: string;
  time: string;
}

export default function NotifikasiPage() {
  // TODO: fetch dari API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "pending",
      title: "Sapi baru menunggu verifikasi",
      message: "Sapi ABC berhasil didaftarkan dan sedang menunggu verifikasi!",
      time: "2 menit lalu",
    },
    {
      id: "2",
      type: "verified",
      title: "Verifikasi dari Pembeli berhasil",
      message: "Sapi Simmental 07 terverifikasi saat diterima pembeli.",
      time: "1 jam lalu",
    },
  ]);

  const handleClearAll = () => {
    // TODO: panggil API untuk hapus semua notifikasi
    setNotifications([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <PageHeader title="Notifications" />

      <div className="bg-white rounded-t-[40px] flex-1 px-7 py-8 flex flex-col gap-4">
        {notifications.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleClearAll}
              className="text-primary text-sm underline cursor-pointer"
            >
              Hapus Semua
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            Belum ada notifikasi.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                type={notif.type}
                title={notif.title}
                message={notif.message}
                time={notif.time}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
