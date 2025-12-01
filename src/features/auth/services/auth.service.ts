import axiosInstance, { fetchMe } from "@/lib/axios";
import type { IUser } from "@/app/store";
import { AxiosError } from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload): Promise<IUser> => {
  const response = await axiosInstance.post("/auth/login", payload);
  console.log("response ", response);

  // Kiểm tra xem response có chứa user data không
  const responseData = response.data as { data?: IUser; [key: string]: any };
  if (
    responseData?.data &&
    typeof responseData.data === "object" &&
    "id" in responseData.data
  ) {
    // Nếu response đã có user data, dùng luôn
    return responseData.data as IUser;
  }

  // Nếu không có, đợi một chút để cookies được set từ response trước khi gọi fetchMe
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Retry logic cho fetchMe nếu lần đầu fail
  let profile: IUser;
  try {
    profile = (await fetchMe()) as IUser;
  } catch (error) {
    // Nếu lần đầu fail, đợi thêm một chút và retry
    await new Promise((resolve) => setTimeout(resolve, 300));
    profile = (await fetchMe()) as IUser;
  }

  return profile;
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
