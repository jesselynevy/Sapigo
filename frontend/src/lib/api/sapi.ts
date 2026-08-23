// src/lib/api/sapi.ts
import { apiClient } from "./client";
import { CowData } from "@/src/types/sapi";

interface AnimalApiResponse {
  id: string;
  owner_id: string;
  display_name: string;
  breed: string | null;
  sex: string | null;
  weight: number | null;
  status: string;
  created_at: string;
  transferred_at: string | null;
}

export interface MediaAssetApiResponse {
  id: string;
  animal_id: string | null;
  media_type: "muzzle_photo" | "other";
  storage_path: string;
}

export interface MuzzleTemplateApiResponse {
  template_id: string;
  animal_id: string;
  reference_image_count: number;
  model_version: string;
}

export interface VerificationApiResponse {
  id: string;
  animal_id: string;
  similarity_score: number;
  decision: "verified" | "manual_review" | "mismatch";
  created_at: string;
}

export interface TransferApiResponse {
  verification: VerificationApiResponse;
  transferred: boolean;
  transferred_at: string | null;
}

export interface CreateAnimalInput {
  owner_id: string;
  display_name: string;
  breed?: string;
  sex?: string;
  weight?: number;
}

export class ReferencePhotoUploadError extends Error {
  constructor(
    public readonly photoIndex: number,
    public readonly cause: unknown,
  ) {
    super("A reference photo could not be uploaded.");
    this.name = "ReferencePhotoUploadError";
  }
}

function mapToCowData(data: AnimalApiResponse): CowData {
  return {
    cowCode: data.id,
    ownerId: data.owner_id,
    display_name: data.display_name,
    breed: data.breed ?? "",
    sex: data.sex ?? "",
    weight: data.weight,
    status: data.status,
    createdAt: data.created_at,
    transferredAt: data.transferred_at,
    verification: "unverified",
  };
}

export async function getCowData(cowId: string, ownerId?: string): Promise<CowData> {
  const search = ownerId ? `?owner_id=${encodeURIComponent(ownerId)}` : "";
  const data = await apiClient<AnimalApiResponse>(`/api/animals/${cowId}${search}`);
  return mapToCowData(data);
}

export async function listAnimals(ownerId: string, includeTransferred = false): Promise<CowData[]> {
  const transferred = includeTransferred ? "&include_transferred=true" : "";
  const data = await apiClient<AnimalApiResponse[]>(`/api/animals?owner_id=${encodeURIComponent(ownerId)}${transferred}`);
  return data.map(mapToCowData);
}

export async function createAnimal(input: CreateAnimalInput): Promise<CowData> {
  const data = await apiClient<AnimalApiResponse>("/api/animals", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return mapToCowData(data);
}

export async function uploadMuzzlePhoto(
  animalId: string,
  file: File,
): Promise<MediaAssetApiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("animal_id", animalId);
  formData.append("media_type", "muzzle_photo");
  return apiClient<MediaAssetApiResponse>("/api/media-assets/upload", {
    method: "POST",
    body: formData,
  });
}

export async function enrollAnimal(
  animalId: string,
  mediaAssetIds: string[],
): Promise<MuzzleTemplateApiResponse> {
  return apiClient<MuzzleTemplateApiResponse>(`/api/animals/${animalId}/enroll`, {
    method: "POST",
    body: JSON.stringify({ media_asset_ids: mediaAssetIds }),
  });
}

/** Uploads every reference photo before creating/replacing the animal template. */
export async function enrollAnimalFromPhotos(
  animalId: string,
  photos: File[],
): Promise<MuzzleTemplateApiResponse> {
  if (photos.length < 3) {
    throw new Error("Take three muzzle photos: middle, left, and right.");
  }

  const mediaAssetIds: string[] = [];
  for (const [photoIndex, photo] of photos.entries()) {
    try {
      const upload = await uploadMuzzlePhoto(animalId, photo);
      mediaAssetIds.push(upload.id);
    } catch (error) {
      throw new ReferencePhotoUploadError(photoIndex, error);
    }
  }
  return enrollAnimal(animalId, mediaAssetIds);
}

export async function verifyAnimal(
  animalId: string,
  file: File,
  ownerId: string,
): Promise<VerificationApiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("owner_id", ownerId);
  return apiClient<VerificationApiResponse>(`/api/animals/${animalId}/verify`, {
    method: "POST",
    body: formData,
  });
}

export async function transferAnimal(
  animalId: string,
  ownerId: string,
  receiverPhone: string,
  file: File,
): Promise<TransferApiResponse> {
  const formData = new FormData();
  formData.append("owner_id", ownerId);
  formData.append("receiver_phone", receiverPhone);
  formData.append("file", file);
  return apiClient<TransferApiResponse>(`/api/animals/${animalId}/transfer`, {
    method: "POST",
    body: formData,
  });
}
