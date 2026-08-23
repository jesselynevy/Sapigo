"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, ImageUp, RotateCcw, X } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (JPG, PNG, or WEBP).");
      return;
    }
    setError(null);
    onChange(file);
    // Allows selecting the same file again after a quality-gate rejection.
    event.target.value = "";
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />
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

      <div className="flex justify-center gap-4 text-sm">
        <button
          type="button"
          onClick={startCamera}
          className="text-primary underline"
        >
          <span className="inline-flex items-center gap-1"><Camera className="w-4 h-4" />{preview ? "Retake with camera" : "Use camera"}</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-primary underline"
        >
          <span className="inline-flex items-center gap-1"><ImageUp className="w-4 h-4" />Choose image file</span>
        </button>
      </div>

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
}
