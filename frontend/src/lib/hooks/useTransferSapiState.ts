"use client";

import { useState, useEffect, useCallback } from "react";
import { fileToBase64, base64ToFile } from "@/src/lib/utils/fileConversion";
import { CowData } from "@/src/types/sapi";

const STORAGE_KEY = "transfer-sapi-state";

interface CowOption {
  id: string;
  cowCode: string;
  info: string;
}
interface StoredState {
  receiverPhone: string;
  selectedCowId: string | null;
  qrPhotoBase64: string | null;
  identityPhotoBase64: string | null;
  transferInfo: CowData | null;
}

const EMPTY_STATE: StoredState = {
  receiverPhone: "",
  selectedCowId: null,
  qrPhotoBase64: null,
  identityPhotoBase64: null,
  transferInfo: null,
};

function readStorage(): StoredState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function writeStorage(state: StoredState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useTransferSapiState() {
  const [receiverPhone, setReceiverPhoneState] = useState("");
  const [selectedCowId, setSelectedCowIdState] = useState<string | null>(null);
  const [qrPhoto, setQrPhotoState] = useState<File | null>(null);
  const [identityPhoto, setIdentityPhotoState] = useState<File | null>(null);
  const [transferInfo, setTransferInfoState] = useState<CowData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    setReceiverPhoneState(stored.receiverPhone);
    setSelectedCowIdState(stored.selectedCowId);
    if (stored.qrPhotoBase64) {
      setQrPhotoState(base64ToFile(stored.qrPhotoBase64, "qr-photo.jpg"));
    }
    if (stored.identityPhotoBase64) {
      setIdentityPhotoState(
        base64ToFile(stored.identityPhotoBase64, "identity-photo.jpg"),
      );
    }
    setTransferInfoState(stored.transferInfo);
    setHydrated(true);
  }, []);

  const setReceiverPhone = useCallback((value: string) => {
    setReceiverPhoneState(value);
    writeStorage({ ...readStorage(), receiverPhone: value });
  }, []);

  const setSelectedCowId = useCallback((id: string | null) => {
    setSelectedCowIdState(id);
    writeStorage({ ...readStorage(), selectedCowId: id });
  }, []);

  const setQrPhoto = useCallback(async (file: File | null) => {
    setQrPhotoState(file);
    writeStorage({
      ...readStorage(),
      qrPhotoBase64: file ? await fileToBase64(file) : null,
    });
  }, []);

  const setIdentityPhoto = useCallback(async (file: File | null) => {
    setIdentityPhotoState(file);
    writeStorage({
      ...readStorage(),
      identityPhotoBase64: file ? await fileToBase64(file) : null,
    });
  }, []);

  const setTransferInfo = useCallback((data: CowData | null) => {
    setTransferInfoState(data);
    writeStorage({ ...readStorage(), transferInfo: data });
  }, []);

  const clearAll = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setReceiverPhoneState("");
    setSelectedCowIdState(null);
    setQrPhotoState(null);
    setIdentityPhotoState(null);
    setTransferInfoState(null);
  }, []);

  return {
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
  };
}

export type { CowOption, CowData };
