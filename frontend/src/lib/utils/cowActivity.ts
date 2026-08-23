import { CowData } from "@/src/types/sapi";

export interface CowActivity {
  id: string;
  type: "Cow in" | "Cow out";
  date: string;
  cow: CowData;
}

export function getCowActivities(cows: CowData[]): CowActivity[] {
  return cows
    .flatMap((cow) => [
      { id: `${cow.cowCode}-in`, type: "Cow in" as const, date: cow.createdAt, cow },
      ...(cow.transferredAt
        ? [{ id: `${cow.cowCode}-out`, type: "Cow out" as const, date: cow.transferredAt, cow }]
        : []),
    ])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
