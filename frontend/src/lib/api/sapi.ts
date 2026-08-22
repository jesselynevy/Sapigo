// src/lib/api/sapi.ts
import { apiClient } from "./client";
import { CowData } from "../hooks/useTransferSapiState";

interface AnimalApiResponse {
  id: string;
  display_name: string;
  breed: string;
  sex: string;
  status: string;
}

function mapToCowData(data: AnimalApiResponse): CowData {
  return {
    cowCode: data.id,
    display_name: data.display_name,
    breed: data.breed,
    sex: data.sex,
    status: data.status,
  };
}

export async function getCowData(cowId: string): Promise<CowData> {
  const data = await apiClient<AnimalApiResponse>(`/api/animals/${cowId}`);
  return mapToCowData(data);
}
