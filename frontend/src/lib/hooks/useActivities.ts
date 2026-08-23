"use client";

import { useState, useEffect } from "react";
import { Activity, ActivityType } from "@/src/types/activity";

interface UseActivitiesOptions {
  type?: ActivityType;
  limit?: number;
}

// TODO: ganti dengan data dari API
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "transfer",
    title: "Sapi ABCDE #ASDSD",
    subtitle: "Info penerimaan kapan(?)",
    timestamp: "2026-08-15T10:00:00Z",
  },
  {
    id: "2",
    type: "transfer",
    title: "Sapi ABCDE #ASDSD",
    subtitle: "Info penerimaan kapan(?)",
    timestamp: "2026-08-14T09:00:00Z",
  },
  {
    id: "3",
    type: "transfer",
    title: "Sapi ABCDE #ASDSD",
    subtitle: "Info penerimaan kapan(?)",
    timestamp: "2026-08-13T09:00:00Z",
  },
  {
    id: "4",
    type: "transfer",
    title: "Sapi ABCDE #ASDSD",
    subtitle: "Info penerimaan kapan(?)",
    timestamp: "2026-08-12T09:00:00Z",
  },
  {
    id: "5",
    type: "verification",
    title: "Sapi ABCDE",
    subtitle: "Telah sukses diverifikasi oleh pembeli #ASDBSD",
    timestamp: "2026-08-16T14:00:00Z",
  },
  {
    id: "6",
    type: "registration",
    title: "Sapi ABCDE",
    subtitle: "Berhasil didaftarkan dan menunggu verifikasi",
    timestamp: "2026-08-16T08:00:00Z",
  },
];

export function useActivities({ type, limit }: UseActivitiesOptions = {}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // TODO: ganti dengan fetch API sesungguhnya, kirim `type` sebagai query param
    // contoh: fetch(`/api/activities${type ? `?type=${type}` : ""}`)
    const timer = setTimeout(() => {
      let result = [...MOCK_ACTIVITIES].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      if (type) {
        result = result.filter((a) => a.type === type);
      }
      if (limit) {
        result = result.slice(0, limit);
      }

      setActivities(result);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [type, limit]);

  return { activities, loading };
}
