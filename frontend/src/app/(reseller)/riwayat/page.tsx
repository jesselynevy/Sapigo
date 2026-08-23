"use client";

import PageHeader from "@/src/components/ui/PageHeader";
import ActivityCard from "@/src/components/home/ActivityCard";
import { useActivities } from "@/src/lib/hooks/useActivities";

interface TransferHistory {
  id: string;
  cowName: string;
  code: string;
  info: string;
}

export default function RiwayatTransferSapiPage() {
  const { activities, loading } = useActivities({ type: "transfer" });

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <PageHeader title="Transfer History" />

      <div className="bg-white rounded-t-[40px] flex-1  px-7 py-8 flex flex-col gap-3">
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            There is no history.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                subtitle={activity.subtitle}
                onClick={() => {
                  // TODO: navigate ke detail transfer
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
