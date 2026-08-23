"use client";

import { useCallback, useEffect, useState } from "react";
import { base64ToFile, fileToBase64 } from "@/src/lib/utils/fileConversion";
import { CowData } from "@/src/types/sapi";

const STORAGE_KEY = "transfer-sapi-state";

interface StoredState {
  receiverPhone: string;
  selectedCow: CowData | null;
  identityPhotoBase64: string | null;
}

const EMPTY_STATE: StoredState = { receiverPhone: "", selectedCow: null, identityPhotoBase64: null };

function readStorage(): StoredState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function writeStorage(state: StoredState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useTransferSapiState() {
  const [receiverPhone, setReceiverPhoneState] = useState("");
  const [selectedCow, setSelectedCowState] = useState<CowData | null>(null);
  const [identityPhoto, setIdentityPhotoState] = useState<File | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    setReceiverPhoneState(stored.receiverPhone);
    setSelectedCowState(stored.selectedCow);
    if (stored.identityPhotoBase64) setIdentityPhotoState(base64ToFile(stored.identityPhotoBase64, "muzzle-photo.jpg"));
    setHydrated(true);
  }, []);

  const setReceiverPhone = useCallback((value: string) => {
    setReceiverPhoneState(value);
    writeStorage({ ...readStorage(), receiverPhone: value });
  }, []);
  const setSelectedCow = useCallback((cow: CowData | null) => {
    setSelectedCowState(cow);
    writeStorage({ ...readStorage(), selectedCow: cow });
  }, []);
  const setIdentityPhoto = useCallback(async (file: File | null) => {
    setIdentityPhotoState(file);
    writeStorage({ ...readStorage(), identityPhotoBase64: file ? await fileToBase64(file) : null });
  }, []);
  const clearAll = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setReceiverPhoneState("");
    setSelectedCowState(null);
    setIdentityPhotoState(null);
  }, []);

  return { receiverPhone, setReceiverPhone, selectedCow, setSelectedCow, identityPhoto, setIdentityPhoto, clearAll, hydrated };
}
