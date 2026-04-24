import type { $Enums } from "@prisma/client";

export interface JwtCustomPayload {
  userId: string;
  email: string;
  role: $Enums.Role;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}