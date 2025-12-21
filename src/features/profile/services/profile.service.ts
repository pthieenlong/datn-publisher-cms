import axiosInstance from "@/lib/axios";
import type {
  UpdateProfilePayload,
  UpdateProfileResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  UploadAvatarResponse,
} from "../types";

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  const response = await axiosInstance.put<UpdateProfileResponse>(
    "/user/profile",
    payload
  );

  return response.data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const response = await axiosInstance.put<ChangePasswordResponse>(
    "/user/password",
    payload
  );

  return response.data;
}

export async function uploadAvatar(file: File): Promise<UploadAvatarResponse> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await axiosInstance.post<UploadAvatarResponse>(
    "/user/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
