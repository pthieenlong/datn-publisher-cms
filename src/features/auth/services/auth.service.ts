import axiosInstance from "@/lib/axios";
import type { IUser } from "@/app/store";
import { AxiosError } from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  };
}

export const login = async (payload: LoginPayload): Promise<IUser> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    payload
  );
  return response.data.data.user;
};

export const logoutRequest = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return;
    }
    throw error;
  }
};
