"use client";

import PageHeader from "@/src/components/ui/PageHeader";
import { useEffect, useState } from "react";
import { listAnimals } from "@/src/lib/api/sapi";
import { useAuthStore } from "@/src/store/useAuthStore";
import { CowData } from "@/src/types/sapi";

export default function RiwayatTransferSapiPage() {
  const user = useAuthStore((state) => state.user);
  const [cows, setCows] = useState<CowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    listAnimals(user.id, true).then(setCows).finally(() => setLoading(false));
  }, [user?.id]);

  const history = cows.flatMap((cow) => [
    { id: `${cow.cowCode}-in`, type: "Cow in", date: cow.createdAt, cow },
    ...(cow.transferredAt ? [{ id: `${cow.cowCode}-out`, type: "Cow out", date: cow.transferredAt, cow }] : []),
  ]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <PageHeader title="Transfer History" />

      <div className="bg-white rounded-t-[40px] flex-1  px-7 py-8 flex flex-col gap-3">
        {loading ? <p className="text-gray-400 text-sm text-center py-8">Loading history...</p> : history.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            There is no history.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-[#D6DCE8] px-4 py-3">
                <p className="font-bold text-black">{activity.type}: {activity.cow.display_name}</p>
                <p className="text-sm text-gray-500">ID: {activity.cow.cowCode}</p>
                <p className="mt-1 text-xs text-gray-400">{new Date(activity.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
