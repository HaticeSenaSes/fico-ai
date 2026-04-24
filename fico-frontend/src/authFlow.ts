import { googleLogin, persistAuthSession, register, type RegisterPayload } from "./authApi";

type NavigateFn = (route: "/onboarding" | "/dashboard") => void;
type SetInlineErrorFn = (field: string, message: string) => void;

export async function submitRegister(
  payload: RegisterPayload,
  navigate: NavigateFn,
  setInlineError: SetInlineErrorFn
): Promise<void> {
  try {
    const result = await register(payload);
    persistAuthSession(result);
    navigate(result.next_route);
  } catch (error: any) {
    const field = error?.detail?.field ?? "form";
    const message = error?.detail?.message ?? "Kayit sirasinda bir hata olustu.";
    setInlineError(field, message);
  }
}

export async function submitGoogleOAuth(
  idToken: string,
  navigate: NavigateFn,
  setInlineError: SetInlineErrorFn
): Promise<void> {
  try {
    const result = await googleLogin(idToken);
    persistAuthSession(result);
    if (result.user.avatar_url) {
      localStorage.setItem("avatar_url", result.user.avatar_url);
    }
    navigate(result.next_route);
  } catch (error: any) {
    const field = error?.detail?.field ?? "google";
    const message = error?.detail?.message ?? "Google ile giris basarisiz.";
    setInlineError(field, message);
  }
}
