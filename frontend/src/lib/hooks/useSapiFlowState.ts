"use client";

import { useState, useEffect, useCallback } from "react";
import { fileToBase64, base64ToFile } from "@/src/lib/utils/fileConversion";
import { CowData } from "@/src/types/sapi";

const STORAGE_KEY = "daftar-sapi-state";

interface StoredState {
  muzzlePhotoBase64: string | null;
  cowData: CowData | null;
}

function readStorage(): StoredState {
  if (typeof window === "undefined") {
    return { muzzlePhotoBase64: null, cowData: null };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { muzzlePhotoBase64: null, cowData: null };
  } catch {
    return { muzzlePhotoBase64: null, cowData: null };
  }
}

function writeStorage(state: StoredState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useSapiFlowState() {
  const [muzzlePhoto, setMuzzlePhotoState] = useState<File | null>(null);
  const [cowData, setCowDataState] = useState<CowData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // hydrate dari sessionStorage saat mount
  useEffect(() => {
    const stored = readStorage();
    if (stored.muzzlePhotoBase64) {
      setMuzzlePhotoState(
        base64ToFile(stored.muzzlePhotoBase64, "muzzle-photo.jpg"),
      );
    }
    if (stored.cowData) {
      setCowDataState(stored.cowData);
    }
    setHydrated(true);
  }, []);

  const setMuzzlePhoto = useCallback(async (file: File | null) => {
    setMuzzlePhotoState(file);
    const current = readStorage();
    writeStorage({
      ...current,
      muzzlePhotoBase64: file ? await fileToBase64(file) : null,
    });
  }, []);

  const setCowData = useCallback((data: CowData | null) => {
    setCowDataState(data);
    const current = readStorage();
    writeStorage({ ...current, cowData: data });
  }, []);

  const clearAll = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMuzzlePhotoState(null);
    setCowDataState(null);
  }, []);

  return {
    muzzlePhoto,
    setMuzzlePhoto,
    cowData,
    setCowData,
    clearAll,
    hydrated, // pakai ini untuk avoid flash of empty state saat awal load
  };
}
