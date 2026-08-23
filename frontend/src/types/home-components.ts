export interface StatCardProps {
  value: number | string;
  label: string;
}

export interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export type CowStatus = "verified" | "mismatch" | "pending";

export interface CowCardProps {
  name: string;
  subtitle: string;
  status: CowStatus;
}

export interface ActivityCardProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}
