import { Truck, CheckCircle2, LucideIcon } from "lucide-react";

type NotificationType = "pending" | "verified" | "info";

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  message: string;
  time: string;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: LucideIcon; iconBg: string; iconColor: string; borderColor: string }
> = {
  pending: {
    icon: Truck,
    iconBg: "bg-orange-100",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
  },
  verified: {
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    borderColor: "border-l-green-500",
  },
  info: {
    icon: Truck,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    borderColor: "border-l-gray-300",
  },
};

export default function NotificationCard({
  type,
  title,
  message,
  time,
}: NotificationCardProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex gap-3 bg-white border border-[#D6DCE8] border-l-4 ${config.borderColor} rounded-xl px-4 py-3`}
    >
      <div
        className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${config.iconBg} ${config.iconColor}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-bold text-black text-sm">{title}</p>
        <p className="text-sm text-gray-500">{message}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
