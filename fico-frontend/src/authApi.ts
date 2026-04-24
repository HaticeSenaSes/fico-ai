export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  onboarding_required: boolean;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
  next_route: "/onboarding" | "/dashboard";
};

export type RegisterPayload = {
  email: string;
  password: string;
  full_name: string;
  kvkk_accepted: boolean;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data as T;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", payload);
}

export async function googleLogin(idToken: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/oauth/google", { id_token: idToken });
}

export function persistAuthSession(payload: AuthResponse): void {
  localStorage.setItem("access_token", payload.access_token);
  localStorage.setItem("refresh_token", payload.refresh_token);
  localStorage.setItem("user", JSON.stringify(payload.user));
}
