"use client";

import Modal from "@/src/components/ui/Modal";
import InfoRow from "@/src/components/ui/InfoRow";
import StatusBadge from "@/src/components/ui/StatusBadge";

interface CowDetail {
  cowCode: string;
  ownership: string;
  weight: number;
  breed: string;
  verification: "verified" | "unverified";
  receivedInfo: string;
}

interface CowDetailModalProps {
  open: boolean;
  onClose: () => void;
  cow: CowDetail | null;
}

export default function CowDetailModal({
  open,
  onClose,
  cow,
}: CowDetailModalProps) {
  if (!cow) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-jakarta font-bold text-black text-lg mb-4">
        Cow Information
      </h2>
      <div className="flex flex-col gap-1 divide-y divide-[#EEF1F6]">
        <InfoRow label="Cow Code" value={cow.cowCode} />
        <InfoRow label="Ownership" value={cow.ownership} />
        <InfoRow label="Weight" value={`${cow.weight} kg`} />
        <InfoRow label="Breed" value={cow.breed} />
        <InfoRow
          label="Verification"
          value={<StatusBadge status={cow.verification} />}
        />
        <InfoRow label="Reception Info" value={cow.receivedInfo} />
      </div>
    </Modal>
  );
}

export type { CowDetail };
