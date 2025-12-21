import axiosInstance from "@/lib/axios";
import type {
  BankInfoListResponse,
  CreateBankInfoPayload,
  CreateBankInfoResponse,
  UpdateBankInfoPayload,
  UpdateBankInfoResponse,
  DeleteBankInfoResponse,
} from "../types";

export async function fetchBankInfoList(
  signal?: AbortSignal
): Promise<BankInfoListResponse> {
  const response = await axiosInstance.get<BankInfoListResponse>(
    "/cms/publisher/bank-info",
    { signal }
  );

  return response.data;
}

export async function createBankInfo(
  payload: CreateBankInfoPayload
): Promise<CreateBankInfoResponse> {
  const response = await axiosInstance.post<CreateBankInfoResponse>(
    "/cms/publisher/bank-info",
    payload
  );

  return response.data;
}

export async function updateBankInfo(
  id: string,
  payload: UpdateBankInfoPayload
): Promise<UpdateBankInfoResponse> {
  const endpoint = `/cms/publisher/bank-info/${encodeURIComponent(id)}`;
  const response = await axiosInstance.put<UpdateBankInfoResponse>(
    endpoint,
    payload
  );

  return response.data;
}

export async function deleteBankInfo(id: string): Promise<DeleteBankInfoResponse> {
  const endpoint = `/cms/publisher/bank-info/${encodeURIComponent(id)}`;
  const response = await axiosInstance.delete<DeleteBankInfoResponse>(endpoint);

  return response.data;
}
