import { useMemo, useState } from "react";
import { submitGoogleOAuth, submitRegister } from "./authFlow";
import { canSubmitRegister, validateRegisterForm } from "./registerValidation";
import { Onboarding } from "./Onboarding";
import { Dashboard } from "./Dashboard";

type Route = "/register" | "/login" | "/onboarding" | "/dashboard";

export function App() {
  const [route, setRoute] = useState<Route>("/register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [googleToken, setGoogleToken] = useState("");
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const formState = useMemo(
    () => ({ email, password, fullName, kvkkAccepted }),
    [email, password, fullName, kvkkAccepted]
  );
  const localValidation = useMemo(() => validateRegisterForm(formState), [formState]);

  const setInlineError = (field: string, message: string) => {
    setInlineErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginError("Email ve şifre zorunludur.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
        setRoute("/dashboard");
      } else {
        setLoginError("Email veya şifre hatalı.");
      }
    } catch {
      setLoginError("Sunucuya bağlanılamadı.");
    }
  };

  if (route === "/onboarding") {
    return <Onboarding onComplete={() => setRoute("/dashboard")} />;
  }

  if (route === "/dashboard") {
    return (
      <Dashboard
        onLogout={() => {
          localStorage.removeItem("access_token");
          setRoute("/login");
        }}
      />
    );
  }

  if (route === "/login") {
    return (
      <div className="page">
        <div className="auth-logo">FiCo AI</div>
        <p className="auth-subtitle">Tekrar hoş geldin 👋</p>
        <div className="card">
          <h2>Giriş Yap</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => { setLoginEmail(e.target.value); setLoginError(""); }}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={loginPassword}
            onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
          />
          <div style={{ textAlign: "right", marginBottom: 16, marginTop: -4 }}>
            <span className="link-text">Şifremi unuttum</span>
          </div>
          {loginError && (
            <div className="errors"><p>{loginError}</p></div>
          )}
          <button onClick={handleLogin}>Giriş Yap</button>
        </div>
        <div className="auth-switch">
          Hesabın yok mu?{" "}
          <span className="link-text" onClick={() => setRoute("/register")}>
            Kayıt Ol
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="auth-logo">FiCo AI</div>
      <p className="auth-subtitle">Finansal özgürlüğüne hoş geldin</p>
      <div className="card">
        <h2>Hesap Oluştur</h2>
        <input
          placeholder="Ad Soyad"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={kvkkAccepted}
            onChange={(e) => setKvkkAccepted(e.target.checked)}
          />
          KVKK onayını kabul ediyorum
        </label>
        <button
          disabled={!canSubmitRegister(formState)}
          onClick={() =>
            submitRegister(
              { email, password, full_name: fullName, kvkk_accepted: kvkkAccepted },
              (next) => setRoute(next as Route),
              setInlineError
            )
          }
        >
          Kayıt Ol
        </button>
        <div className="errors">
          {Object.values(localValidation).map((error) => (
            <p key={error}>{error}</p>
          ))}
          {Object.entries(inlineErrors).map(([field, error]) => (
            <p key={`${field}:${error}`}>{field}: {error}</p>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Google ile Giriş</h2>
        <textarea
          rows={4}
          placeholder='{"iss":"accounts.google.com","email":"demo@example.com","name":"Demo","picture":"https://..."}'
          value={googleToken}
          onChange={(e) => setGoogleToken(e.target.value)}
        />
        <button
          onClick={() =>
            submitGoogleOAuth(googleToken, (next) => setRoute(next as Route), setInlineError)
          }
        >
          Google ile Devam Et
        </button>
      </div>
      <div className="auth-switch">
        Zaten hesabın var mı?{" "}
        <span className="link-text" onClick={() => setRoute("/login")}>
          Giriş Yap
        </span>
      </div>
    </div>
  );
}