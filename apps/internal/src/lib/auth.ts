import axios from "axios";

const adminApi = axios.create({
  baseURL: "/api/v2/admin",
  withCredentials: true,
});

export interface AdminProfile {
  authenticated: boolean;
  user: {
    id: number;
    email: string;
    role: string;
    additionalInfo?: { name?: string | null } | null;
  };
}

function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export async function refreshAdminSession(): Promise<void> {
  await adminApi.post("/refresh");
}

export async function getAdminSession(): Promise<AdminProfile | null> {
  try {
    const { data } = await adminApi.get<AdminProfile>("/me");
    return data;
  } catch (error) {
    if (!isUnauthorized(error)) throw error;
  }

  try {
    await refreshAdminSession();
    const { data } = await adminApi.get<AdminProfile>("/me");
    return data;
  } catch (error) {
    if (isUnauthorized(error)) return null;
    throw error;
  }
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<AdminProfile> {
  await adminApi.post("/login", { email, password });
  const { data } = await adminApi.get<AdminProfile>("/me");
  return data;
}

export async function logoutAdmin(): Promise<void> {
  await adminApi.post("/logout");
}
