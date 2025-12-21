export interface BankInfo {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchName: string;
  swiftCode: string;
  isVerified: boolean;
  isPrimary: boolean;
  createdAt: string;
}

export interface BankInfoListResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: BankInfo[];
}

export interface CreateBankInfoPayload {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchName?: string;
  swiftCode?: string;
  isPrimary?: boolean;
}

export interface CreateBankInfoResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: BankInfo;
}

export interface UpdateBankInfoPayload {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  branchName?: string;
  swiftCode?: string;
  isPrimary?: boolean;
}

export interface UpdateBankInfoResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: BankInfo;
}

export interface DeleteBankInfoResponse {
  httpCode: number;
  success: boolean;
  message: string;
}
