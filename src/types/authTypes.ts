import { User } from "@/lib/state/context/jotai-auth";

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  expiresIn?: number;
}
export interface TokenResponse {
  authToken: AuthToken;
  userData: User;
}
