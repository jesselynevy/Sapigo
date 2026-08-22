import jsQR from "jsqr";
import { Dispatch, SetStateAction } from "react";
import { CowData } from "../hooks/useTransferSapiState";

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
  ``;
  // 3. Extract cow_id from the decoded URL
  const cowId = code.data.split("/").pop();
  if (!cowId) {
    setError("QR code did not contain a valid cow ID.");
    return;
  }

  // 4. Fetch cow data from your backend
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/animals/${cowId}`);
    if (!res.ok) {
      setError("Cow not found.");
      return;
    }
    const data = await res.json();

    // 5. Map backend response into whatever shape transferInfo expects
    const cowData: CowData = {
      cowCode: data.id,
      display_name: data.display_name,
      breed: data.breed,
      sex: data.sex,
      status: data.status,
    };

    setCowData(cowData);

    onSuccess(cowId, cowData);
  } catch (err) {
    setError("Failed to fetch cow data.");
  }
}
