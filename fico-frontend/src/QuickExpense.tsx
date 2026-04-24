import { useState } from "react";

const CATEGORIES = [
  { id: "yiyecek", label: "🍔", name: "Yiyecek" },
  { id: "ulasim", label: "🚌", name: "Ulaşım" },
  { id: "kira", label: "🏠", name: "Kira" },
  { id: "egitim", label: "📚", name: "Eğitim" },
  { id: "eglence", label: "🎮", name: "Eğlence" },
  { id: "saglik", label: "💊", name: "Sağlık" },
  { id: "giyim", label: "👕", name: "Giyim" },
  { id: "market", label: "🛒", name: "Market" },
  { id: "abonelik", label: "📱", name: "Abonelik" },
  { id: "diger", label: "📦", name: "Diğer" },
];

type QuickExpenseProps = {
  onClose: () => void;
  onSaved: () => void;
};

export function QuickExpense({ onClose, onSaved }: QuickExpenseProps) {
  const [amount, setAmount] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"amount" | "category">("amount");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAmountNext = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Tutar 0'dan büyük olmalı.");
      return;
    }
    setError("");
    setStep("category");
  };

  const handleSave = async () => {
    if (!selectedCat) {
      setError("Kategori seçmelisin.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      await fetch("http://localhost:8000/api/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "expense",
          amount: parseFloat(amount),
          category_id: selectedCat,
          note: note || null,
          transaction_at: new Date().toISOString(),
        }),
      });
    } catch {
      // Backend hazır olmasa da devam et
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>

        <div className="modal-handle" />

        <div className="modal-header">
          <h2 className="modal-title">Hızlı Gider</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Adım 1 — Tutar */}
        {step === "amount" && (
          <>
            <div className="qe-amount-display">
              <span className="qe-currency">₺</span>
              <input
                className="qe-amount-input"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                autoFocus
              />
            </div>
            <input
              className="qe-note-input"
              type="text"
              placeholder="Not ekle (opsiyonel)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={100}
            />
            {error && <p className="qe-error">{error}</p>}
            <button className="qe-next-btn" onClick={handleAmountNext}>
              İleri →
            </button>
          </>
        )}

        {/* Adım 2 — Kategori */}
        {step === "category" && (
          <>
            <div className="qe-amount-confirm">
              ₺{parseFloat(amount).toLocaleString("tr-TR")}
            </div>
            <p className="qe-cat-label">Kategori seç</p>
            <div className="qe-cat-grid">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`qe-cat-item${selectedCat === cat.id ? " selected" : ""}`}
                  onClick={() => { setSelectedCat(cat.id); setError(""); }}
                >
                  <span className="qe-cat-icon">{cat.label}</span>
                  <span className="qe-cat-name">{cat.name}</span>
                </div>
              ))}
            </div>
            {error && <p className="qe-error">{error}</p>}
            <div className="qe-actions">
              <button
                className="qe-back-btn"
                onClick={() => { setStep("amount"); setSelectedCat(""); }}
              >
                ← Geri
              </button>
              <button
                className="qe-save-btn"
                disabled={!selectedCat || saving}
                onClick={handleSave}
              >
                {saving ? "Kaydediliyor..." : "Kaydet ✓"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}