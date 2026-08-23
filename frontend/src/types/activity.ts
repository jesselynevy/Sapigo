export type ActivityType =
  | "transfer"
  | "verification"
  | "registration"
  | "other";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  timestamp: string;
}
