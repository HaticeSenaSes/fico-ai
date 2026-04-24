import { useState } from "react";

type Transaction = {
  id: string;
  type: "expense" | "income";
  amount: number;
  category_id: string;
  note: string | null;
  transaction_at: string;
};

const CATEGORY_MAP: Record<string, { label: string; icon: string; color: string }> = {
  yiyecek:  { label: "Yiyecek",  icon: "🍔", color: "#FEF3C7" },
  ulasim:   { label: "Ulaşım",   icon: "🚌", color: "#E0F7F8" },
  kira:     { label: "Kira",     icon: "🏠", color: "#EDE9FE" },
  egitim:   { label: "Eğitim",   icon: "📚", color: "#DBEAFE" },
  eglence:  { label: "Eğlence",  icon: "🎮", color: "#FCE7F3" },
  saglik:   { label: "Sağlık",   icon: "💊", color: "#D1FAE5" },
  giyim:    { label: "Giyim",    icon: "👕", color: "#FEE2E2" },
  market:   { label: "Market",   icon: "🛒", color: "#E0F7F8" },
  abonelik: { label: "Abonelik", icon: "📱", color: "#EDE9FE" },
  diger:    { label: "Diğer",    icon: "📦", color: "#F3F4F6" },
  burs:     { label: "Burs",     icon: "💰", color: "#D1FAE5" },
  harçlık:  { label: "Harçlık",  icon: "💵", color: "#D1FAE5" },
};

const MOCK: Transaction[] = [
  { id: "1", type: "expense", amount: 85,   category_id: "yiyecek",  note: "Starbucks",  transaction_at: "2026-04-24T09:14:00Z" },
  { id: "2", type: "income",  amount: 3500, category_id: "burs",     note: "Nisan bursu", transaction_at: "2026-04-23T08:00:00Z" },
  { id: "3", type: "expense", amount: 320,  category_id: "market",   note: "Migros",      transaction_at: "2026-04-22T17:30:00Z" },
  { id: "4", type: "expense", amount: 180,  category_id: "abonelik", note: "Netflix",     transaction_at: "2026-04-21T10:00:00Z" },
  { id: "5", type: "expense", amount: 45,   category_id: "ulasim",   note: "Metro",       transaction_at: "2026-04-21T08:20:00Z" },
  { id: "6", type: "expense", amount: 650,  category_id: "giyim",    note: "Zara",        transaction_at: "2026-04-20T14:00:00Z" },
];

type Props = { onBack: () => void };

export function TransactionList({ onBack }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "expense" | "income">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  const filtered = MOCK
    .filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (search) {
        const cat = CATEGORY_MAP[t.category_id]?.label.toLowerCase() ?? "";
        const note = (t.note ?? "").toLowerCase();
        if (!cat.includes(search.toLowerCase()) && !note.includes(search.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) =>
      sortBy === "date"
        ? new Date(b.transaction_at).getTime() - new Date(a.transaction_at).getTime()
        : b.amount - a.amount
    );

  // Tarihe göre grupla
  const groups: Record<string, Transaction[]> = {};
  for (const t of filtered) {
    const date = new Date(t.transaction_at).toLocaleDateString("tr-TR", {
      day: "numeric", month: "long", year: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
  }

  const dayTotal = (txs: Transaction[]) =>
    txs.reduce((sum, t) => sum + (t.type === "expense" ? -t.amount : t.amount), 0);

  return (
    <div className="dash-root">

      {/* Nav */}
      <nav className="dash-nav">
        <div className="dash-nav-logo">FiCo AI</div>
        <div className="dash-nav-links">
          <span className="dash-nav-item" onClick={onBack}>Ana Sayfa</span>
          <span className="dash-nav-item active">Giderler</span>
          <span className="dash-nav-item">Gelir</span>
          <span className="dash-nav-item">Hedefler</span>
        </div>
        <div className="dash-nav-right">
          <div className="dash-avatar">HS</div>
        </div>
      </nav>

      <main className="dash-main">

        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">İşlemler</h1>
            <p className="dash-date">{filtered.length} kayıt</p>
          </div>
        </div>

        {/* Filtre Bar */}
        <div className="tl-filter-bar">
          <input
            className="tl-search"
            type="text"
            placeholder="🔍  Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="tl-type-toggle">
            {(["all", "expense", "income"] as const).map((t) => (
              <button
                key={t}
                className={`tl-toggle-btn${typeFilter === t ? " active" : ""}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === "all" ? "Tümü" : t === "expense" ? "Gider" : "Gelir"}
              </button>
            ))}
          </div>
          <select
            className="tl-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
          >
            <option value="date">Tarihe göre</option>
            <option value="amount">Tutara göre</option>
          </select>
        </div>

        {/* Liste */}
        {Object.keys(groups).length === 0 ? (
          <div className="dash-card">
            <div className="dash-empty">
              <div className="dash-empty-icon">🔍</div>
              <div className="dash-empty-text">Sonuç bulunamadı</div>
              <div className="dash-empty-sub">Filtrelerini değiştirmeyi dene</div>
            </div>
          </div>
        ) : (
          Object.entries(groups).map(([date, txs]) => (
            <div key={date} className="tl-group">
              <div className="tl-group-header">
                <span>{date}</span>
                <span className={`tl-group-total ${dayTotal(txs) >= 0 ? "pos" : "neg"}`}>
                  {dayTotal(txs) >= 0 ? "+" : ""}
                  ₺{Math.abs(dayTotal(txs)).toLocaleString("tr-TR")}
                </span>
              </div>
              <div className="dash-card" style={{ padding: 0 }}>
                {txs.map((tx, i) => {
                  const cat = CATEGORY_MAP[tx.category_id] ?? { label: "Diğer", icon: "📦", color: "#F3F4F6" };
                  return (
                    <div key={tx.id} className={`tl-row${i < txs.length - 1 ? " bordered" : ""}`}>
                      <div className="tl-cat-icon" style={{ background: cat.color }}>
                        {cat.icon}
                      </div>
                      <div className="tl-info">
                        <div className="tl-name">{tx.note ?? cat.label}</div>
                        <div className="tl-meta">
                          {cat.label} · {new Date(tx.transaction_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className={`tl-amount ${tx.type === "expense" ? "neg" : "pos"}`}>
                        {tx.type === "expense" ? "-" : "+"}₺{tx.amount.toLocaleString("tr-TR")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

      </main>

      {/* Mobil Alt Nav */}
      <nav className="dash-bottom-nav">
        <div className="dash-bottom-item" onClick={onBack}><span>🏠</span><span>Ana Sayfa</span></div>
        <div className="dash-bottom-item active"><span>💸</span><span>Giderler</span></div>
        <div className="dash-bottom-item"><span>💰</span><span>Gelir</span></div>
        <div className="dash-bottom-item"><span>🎯</span><span>Hedefler</span></div>
        <div className="dash-bottom-item"><span>👤</span><span>Profil</span></div>
      </nav>

    </div>
  );
}