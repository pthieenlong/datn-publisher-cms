export interface UpdateProfilePayload {
  username?: string;
}

export interface UpdateProfileResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
  };
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  httpCode: number;
  success: boolean;
  message: string;
}

export interface UploadAvatarResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    avatarUrl: string;
  };
}
