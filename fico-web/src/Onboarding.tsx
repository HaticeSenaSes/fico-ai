import { useState } from "react";


type OnboardingProps = {
  onComplete: () => void;
};

const INCOME_TYPES = [
  { id: "burs", label: "Burs" },
  { id: "harçlık", label: "Harçlık" },
  { id: "part_time", label: "Part-time" },
  { id: "serbest", label: "Serbest" },
  { id: "diger", label: "Diğer" },
];

const CATEGORIES = [
  { id: "yiyecek", label: "🍔 Yiyecek" },
  { id: "ulasim", label: "🚌 Ulaşım" },
  { id: "kira", label: "🏠 Kira" },
  { id: "egitim", label: "📚 Eğitim" },
  { id: "eglence", label: "🎮 Eğlence" },
  { id: "saglik", label: "💊 Sağlık" },
  { id: "giyim", label: "👕 Giyim" },
  { id: "market", label: "🛒 Market" },
  { id: "abonelik", label: "📱 Abonelik" },
  { id: "diger", label: "📦 Diğer" },
];

const GOAL_TYPES = [
  { id: "saving", label: "💰 Biriktirmek", desc: "Para biriktirmeyi hedefliyorum" },
  { id: "understand", label: "📊 Anlamak", desc: "Harcamalarımı anlamak istiyorum" },
  { id: "cut", label: "✂️ Tasarruf", desc: "Gereksiz harcamaları kesmek istiyorum" },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const TOTAL = 5;

  // Adım 1 — Gelir
  const [selectedIncomes, setSelectedIncomes] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  // Adım 2 — Kategoriler
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  // Adım 3 — Hedef tipi
  const [goalType, setGoalType] = useState("");

  // Adım 4 — Bildirim
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState("09:00");

  const toggleIncome = (id: string) => {
    setSelectedIncomes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCat = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    if (step === 1) return selectedIncomes.length > 0;
    if (step === 2) return selectedCats.length > 0;
    if (step === 3) return goalType !== "";
    return true;
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch("http://localhost:8000/api/v1/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monthly_income: Object.values(amounts).reduce(
            (sum, v) => sum + (parseFloat(v) || 0), 0
          ),
          income_sources: selectedIncomes,
          preferred_categories: selectedCats,
          financial_goal_type: goalType,
          notification_time: notifEnabled ? notifTime : null,
        }),
      });
    } catch {
      // Backend henüz hazır olmasa da devam et
    }
    onComplete();
  };

  return (
    <div className="page">
      <div className="auth-logo">FiCo AI</div>

      {/* Progress bar */}
      <div className="ob-progress">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className={`ob-progress-seg${i < step ? " active" : ""}`}
          />
        ))}
      </div>

      {/* Adım 1 — Gelir */}
      {step === 1 && (
        <div className="card">
          <h2>Gelir Kaynakların</h2>
          <p className="ob-desc">Hangi gelir kaynaklarına sahipsin?</p>
          <div className="ob-chip-grid">
            {INCOME_TYPES.map((inc) => (
              <div
                key={inc.id}
                className={`ob-chip${selectedIncomes.includes(inc.id) ? " selected" : ""}`}
                onClick={() => toggleIncome(inc.id)}
              >
                {inc.label}
              </div>
            ))}
          </div>
          {selectedIncomes.map((id) => (
            <div key={id} className="ob-amount-row">
              <label className="ob-amount-label">
                {INCOME_TYPES.find((x) => x.id === id)?.label} — Aylık tutar
              </label>
              <input
                type="number"
                placeholder="₺0"
                value={amounts[id] || ""}
                onChange={(e) =>
                  setAmounts((prev) => ({ ...prev, [id]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Adım 2 — Kategoriler */}
      {step === 2 && (
        <div className="card">
          <h2>Harcama Kategorileri</h2>
          <p className="ob-desc">Hangi kategorilerde harcama yapıyorsun?</p>
          <div className="ob-chip-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`ob-chip${selectedCats.includes(cat.id) ? " selected" : ""}`}
                onClick={() => toggleCat(cat.id)}
              >
                {cat.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adım 3 — Hedef */}
      {step === 3 && (
        <div className="card">
          <h2>Finansal Hedefin</h2>
          <p className="ob-desc">Bu uygulamayı neden kullanmak istiyorsun?</p>
          <div className="ob-goal-grid">
            {GOAL_TYPES.map((g) => (
              <div
                key={g.id}
                className={`ob-goal-card${goalType === g.id ? " selected" : ""}`}
                onClick={() => setGoalType(g.id)}
              >
                <div className="ob-goal-icon">{g.label.split(" ")[0]}</div>
                <div className="ob-goal-text">
                  <div className="ob-goal-title">
                    {g.label.split(" ").slice(1).join(" ")}
                  </div>
                  <div className="ob-goal-desc">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adım 4 — Bildirim */}
      {step === 4 && (
        <div className="card">
          <h2>Günlük Hatırlatma</h2>
          <p className="ob-desc">
            Her gün harcamalarını girmeni hatırlatalım mı?
          </p>
          <label style={{ marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={notifEnabled}
              onChange={(e) => setNotifEnabled(e.target.checked)}
            />
            Evet, hatırlat
          </label>
          {notifEnabled && (
            <input
              type="time"
              value={notifTime}
              onChange={(e) => setNotifTime(e.target.value)}
            />
          )}
          <p className="ob-skip" onClick={() => setStep(5)}>
            Şimdi değil
          </p>
        </div>
      )}

      {/* Adım 5 — Hazır */}
      {step === 5 && (
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h2>Her şey hazır!</h2>
          <p className="ob-desc">
            Finansal yolculuğun başlıyor. İlk harcamanı girerek başla.
          </p>
          <button onClick={handleComplete}>Dashboard'a Git</button>
        </div>
      )}

      {/* Navigasyon */}
      {step < 5 && (
        <div className="ob-nav">
          {step > 1 && (
            <button className="ob-back-btn" onClick={() => setStep((s) => s - 1)}>
              ← Geri
            </button>
          )}
          <button
            disabled={!canNext()}
            onClick={() => setStep((s) => s + 1)}
            style={{ flex: 1 }}
          >
            {step === 4 ? "Tamamla" : "İleri →"}
          </button>
        </div>
      )}
    </div>
  );
}