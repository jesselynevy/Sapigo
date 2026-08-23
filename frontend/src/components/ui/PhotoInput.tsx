"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, RotateCcw, X } from "lucide-react";

interface PhotoInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
}

export default function PhotoInput({
  value,
  onChange,
  placeholder = "Input Field foto biasa",
}: PhotoInputProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // generate/cleanup preview url dari file yang sudah diambil
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      setError("Tidak bisa mengakses kamera. Periksa izin kamera di browser.");
    }
  }, [facingMode]);

  // restart stream tiap kali facingMode berubah selagi kamera terbuka
  useEffect(() => {
    if (isCameraOpen) {
      stopCamera();
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onChange(file);
        stopCamera();
        setIsCameraOpen(false);
      },
      "image/jpeg",
      0.9,
    );
  };

  const handleClose = () => {
    stopCamera();
    setIsCameraOpen(false);
  };

  // ---- camera view (fullscreen-ish overlay dalam card) ----
  if (isCameraOpen) {
    return (
      <div className="w-full aspect-square bg-black rounded-xl overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        <button
          onClick={handleClose}
          className="absolute top-3 cursor-pointer left-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          onClick={() =>
            setFacingMode((m) => (m === "environment" ? "user" : "environment"))
          }
          className="absolute top-3 right-3 cursor-pointer  w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleCapture}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-primary"
        />
      </div>
    );
  }

  // ---- default state: preview atau placeholder, tap untuk buka kamera ----
  return (
    <div className="w-full flex flex-col gap-2">
      <div
        onClick={startCamera}
        className="w-full aspect-square bg-white border border-[#D6DCE8] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 px-6 text-center">
            <Camera className="w-8 h-8" />
            <span className="text-sm">{placeholder}</span>
          </div>
        )}
      </div>

      {preview && (
        <button
          type="button"
          onClick={startCamera}
          className="text-primary text-sm underline self-center"
        >
          Ambil ulang foto
        </button>
      )}

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
}
