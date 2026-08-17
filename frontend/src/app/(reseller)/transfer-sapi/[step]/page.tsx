"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import StepFlowLayout from "@/src/components/ui/StepFlowLayout";
import PhotoInput from "@/src/components/ui/PhotoInput";
import Input from "@/src/components/ui/Input";
import InfoRow from "@/src/components/ui/InfoRow";
import StatusBadge from "@/src/components/ui/StatusBadge";
import SelectableListItem from "@/src/components/ui/SelectableListItem";
import {
  useTransferSapiState,
  CowOption,
} from "@/src/lib/hooks/useTransferSapiState";

const TOTAL_STEPS = 6;

// TODO: ganti dengan data dari API (sapi milik user yang sedang login)
const MOCK_COWS: CowOption[] = [
  { id: "1", cowCode: "Sapi ABCDE #ASDSD", info: "Info penerimaan kapan(?)" },
  { id: "2", cowCode: "Sapi ABCDE #ASDSD", info: "Info penerimaan kapan(?)" },
  { id: "3", cowCode: "Sapi ABCDE #ASDSD", info: "Info penerimaan kapan(?)" },
  { id: "4", cowCode: "Sapi ABCDE #ASDSD", info: "Info penerimaan kapan(?)" },
  { id: "5", cowCode: "Sapi ABCDE #ASDSD", info: "Info penerimaan kapan(?)" },
  { id: "6", cowCode: "Sapi ABCDE #ASDSD", info: "Info penerimaan kapan(?)" },
  { id: "7", cowCode: "Sapi ABCDE #ASDSD", info: "Info penerimaan kapan(?)" },
];

export default function TransferSapiStepPage() {
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const step = Number(params.step);

  const {
    receiverPhone,
    setReceiverPhone,
    selectedCowId,
    setSelectedCowId,
    qrPhoto,
    setQrPhoto,
    identityPhoto,
    setIdentityPhoto,
    transferInfo,
    setTransferInfo,
    clearAll,
    hydrated,
  } = useTransferSapiState();

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCows = MOCK_COWS.filter((cow) =>
    cow.cowCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // redirect kalau step tidak valid
  useEffect(() => {
    if (!hydrated) return;
    if (isNaN(step) || step < 1 || step > 6) {
      router.replace("/transfer-sapi/1");
    }
  }, [step, hydrated, router]);

  // simulasi lookup info transfer begitu masuk step 3
  useEffect(() => {
    if (step === 3 && !transferInfo) {
      // TODO: ganti dengan API call berdasarkan qrPhoto/selectedCowId
      setTransferInfo({
        cowCode: "X-ASJAAJAJA-AJAJAJAJJA",
        ownership: "Farmer ABC",
        weight: 3,
        breed: "Limousine",
        verification: "verified",
      });
    }
  }, [step, transferInfo, setTransferInfo]);

  // step 5: proses verifikasi -> lanjut ke step 6
  useEffect(() => {
    if (step === 5) {
      setLoading(true);
      (async () => {
        try {
          // TODO: panggil API verifikasi identitas sapi
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [step]);

  const goToStep = (s: number) => router.push(`/transfer-sapi/${s}`);

  const handleBack = () => {
    if (step === 1) {
      router.push("/home");
      return;
    }
    goToStep(step - 1);
  };

  const handleNext = () => {
    if (step === 5) {
      goToStep(6);
      return;
    }
    goToStep(step + 1);
  };

  const handleFinish = () => {
    clearAll();
    router.push("/home");
  };

  const canProceed = () => {
    if (step === 1) return !!receiverPhone && !!selectedCowId;
    if (step === 2) return !!qrPhoto;
    if (step === 4) return !!identityPhoto;
    if (step === 5) return !loading;
    return true;
  };

  if (!hydrated) return null;

  return (
    <StepFlowLayout
      title="Transfer a Cow"
      totalSteps={TOTAL_STEPS}
      currentStep={Math.min(step, TOTAL_STEPS)}
      onBack={() => {
        router.push("/home");
      }}
      showProgress={step <= 6}
      showPrimaryButton={step !== 6}
      primaryDisabled={!canProceed()}
      onPrimaryClick={handleNext}
      showSecondaryButton={step !== 1}
      secondaryLabel="Kembali"
      onSecondaryClick={step === 6 ? handleFinish : handleBack}
    >
      {/* STEP 1: nomor telepon + pilih sapi */}
      {step === 1 && (
        <>
          <Input
            label="Masukkan nomor telepon penerima"
            placeholder="+62 XXXXXXXXXXXX"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <p className="font-bold  text-gray-700">
              Pilih sapi yang ingin ditransfer
            </p>
            <input
              placeholder="Cari sapi dengan ID, nama, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 text-black py-2 bg-white border border-[#D6DCE8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto h-[43vh]">
            {filteredCows.map((cow) => (
              <SelectableListItem
                key={cow.id}
                title={cow.cowCode}
                subtitle={cow.info}
                selected={selectedCowId === cow.id}
                onClick={() => setSelectedCowId(cow.id)}
              />
            ))}
            {filteredCows.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">
                Sapi tidak ditemukan.
              </p>
            )}
          </div>
        </>
      )}

      {/* STEP 2: pemeriksaan QR Code */}
      {step === 2 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Identification of QR Code
            </h2>
            <h3 className="font-jakarta text-gray-500 text-center">
              Please point your camera to the QR Code of the ear tags
            </h3>
          </div>
          <PhotoInput
            value={qrPhoto}
            onChange={setQrPhoto}
            placeholder="Foto QR Code pada sapi"
          />
        </>
      )}

      {/* STEP 3: information of transfer */}
      {step === 3 && transferInfo && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Information of Transfer
            </h2>
            <h3 className="font-jakarta text-gray-500 text-center">
              Please make sure the details are correct.
            </h3>
          </div>
          <div className="border border-[#D6DCE8] rounded-xl px-4 py-2 divide-y divide-[#EEF1F6]">
            <InfoRow label="Cow Code" value={transferInfo.cowCode} />
            <InfoRow label="Ownership" value={transferInfo.ownership} />
            <InfoRow label="Weight" value={`${transferInfo.weight} kg`} />
            <InfoRow label="Breed" value={transferInfo.breed} />
            <InfoRow
              label="Verification"
              value={<StatusBadge status={transferInfo.verification} />}
            />
          </div>
          <div className="border border-[#D6DCE8] rounded-xl px-4 py-2">
            <InfoRow label="No telp Penerima" value={receiverPhone} />
          </div>
        </>
      )}

      {/* STEP 4: identity check */}
      {step === 4 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Biometric Identity of Cow Verification
            </h2>
            <h3 className="font-jakarta text-gray-500 text-center">
              Please point your camera towards the muzzle of the cow.
            </h3>
          </div>
          <PhotoInput
            value={identityPhoto}
            onChange={setIdentityPhoto}
            placeholder="Foto muzzle sapi"
          />
        </>
      )}

      {/* STEP 5: hasil verifikasi */}
      {step === 5 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-black text-center">
              Results of Verification
            </h2>
            <h3 className="font-jakarta text-gray-500 text-center">
              Please check again if it is the correct cow.
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[300px] border border-[#D6DCE8] rounded-xl">
            <span className="text-gray-400">
              {loading ? "Memverifikasi..." : "Info hasil verifikasi sapinya"}
            </span>
          </div>
        </>
      )}

      {/* STEP 6: success */}
      {step === 6 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 border bg-white border-[#D6DCE8] rounded-xl min-h-[350px]">
          <CheckCircle2 className="w-16 h-16 text-green-700" />
          <p className="text-center font-bold text-black px-8">
            Cow ABCE is confirmed for transfer!
          </p>
          <p className="text-center text-sm text-gray-500 px-8">
            We'll let you know if the buyer has verified the cow.
          </p>
        </div>
      )}
    </StepFlowLayout>
  );
}
