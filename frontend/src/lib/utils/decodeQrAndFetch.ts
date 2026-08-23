import jsQR from "jsqr";
import { Dispatch, SetStateAction } from "react";
import { CowData } from "@/src/types/sapi";
import { getCowData } from "../api/sapi";

export async function decodeQrAndFetch(
  photo: File,
  setError: Dispatch<SetStateAction<string | null>>,
  setCowData: (data: CowData | null) => void,
  onSuccess: (cowId: string, data: CowData) => void,
) {
  setError(null);

  // 1. Load the image into a canvas so we can read pixel data
  const imageBitmap = await createImageBitmap(photo);
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imageBitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 2. Decode QR
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (!code) {
    setError("Could not read QR code. Try again with better lighting/focus.");
    return;
  }
  // 3. Extract the canonical animal and owner identity from the QR URL.
  let cowId: string | null = null;
  let ownerId: string | undefined;
  try {
    const url = new URL(code.data);
    cowId = url.pathname.split("/").filter(Boolean).pop() ?? null;
    ownerId = url.searchParams.get("owner_id") ?? undefined;
  } catch {
    setError("QR code did not contain a valid verification link.");
    return;
  }
  if (!cowId) {
    setError("QR code did not contain a valid cow ID.");
    return;
  }

  // 4. Fetch cow data from your backend
  try {
    const cowData: CowData = await getCowData(cowId, ownerId);

    setCowData(cowData);

    onSuccess(cowId, cowData);
  } catch (err) {
    setError("Failed to fetch cow data.");
  }
}
