import { v4 as uuidv4 } from "uuid";
import type { SSETokenData, TokenValidation } from "../types.js";

// Temporary SSE tokens (uploadId -> {token, createdAt, ipAddress})
export const sseTokenMap = new Map<string, SSETokenData>();

// SSE 토큰 생성 함수
export function generateSSEToken(uploadId: string, ipAddress: string): string {
  const token = uuidv4();
  const createdAt = Date.now();
  const expiresAt = createdAt + 5 * 60 * 1000; // 5분 후 만료

  sseTokenMap.set(uploadId, {
    token,
    createdAt,
    expiresAt,
    ipAddress,
    used: false,
  });

  // 5분 후 자동 정리
  setTimeout(
    () => {
      sseTokenMap.delete(uploadId);
    },
    5 * 60 * 1000,
  );

  return token;
}

// SSE 토큰 검증 함수
export function validateSSEToken(
  uploadId: string,
  token: string,
  ipAddress: string,
): TokenValidation {
  const tokenData = sseTokenMap.get(uploadId);

  if (!tokenData) {
    return { valid: false, reason: "Token not found" };
  }

  if (tokenData.used) {
    return { valid: false, reason: "Token already used" };
  }

  if (Date.now() > tokenData.expiresAt) {
    sseTokenMap.delete(uploadId);
    return { valid: false, reason: "Token expired" };
  }

  if (tokenData.token !== token) {
    return { valid: false, reason: "Invalid token" };
  }

  if (tokenData.ipAddress !== ipAddress) {
    return { valid: false, reason: "IP address mismatch" };
  }

  // 토큰을 사용됨으로 표시
  tokenData.used = true;

  return { valid: true };
}
