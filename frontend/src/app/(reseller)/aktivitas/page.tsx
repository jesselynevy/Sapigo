"use client";

import PageHeader from "@/src/components/ui/PageHeader";
import ActivityCard from "@/src/components/home/ActivityCard";
import { useActivities } from "@/src/lib/hooks/useActivities";

export default function AktivitasPage() {
  const { activities, loading } = useActivities();

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <PageHeader title="Activity" />

      <div className="bg-white rounded-t-[40px] flex-1 px-7 py-8 flex flex-col gap-3">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            There isn't any activity yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                subtitle={activity.subtitle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
