import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { QuickExpense } from "./QuickExpense";
import { TransactionList } from "./TransactionList";

type DashboardProps = {
  onLogout: () => void;
};

const weeklyData = [
  { gun: "Pzt", tutar: 120 },
  { gun: "Sal", tutar: 85 },
  { gun: "Çar", tutar: 320 },
  { gun: "Per", tutar: 45 },
  { gun: "Cum", tutar: 650 },
  { gun: "Cmt", tutar: 180 },
  { gun: "Paz", tutar: 95 },
];

const categoryData = [
  { name: "Yiyecek", value: 850,  color: "#0EA5B0" },
  { name: "Ulaşım",  value: 320,  color: "#F59E0B" },
  { name: "Giyim",   value: 650,  color: "#10B981" },
  { name: "Market",  value: 420,  color: "#6366F1" },
  { name: "Diğer",   value: 260,  color: "#94A3B4" },
];

const RECENT = [
  { id: "1", icon: "🍔", name: "Starbucks",   cat: "Yiyecek",  amount: -85,   color: "#FEF3C7" },
  { id: "2", icon: "💰", name: "Nisan Bursu", cat: "Gelir",    amount: 3500,  color: "#D1FAE5" },
  { id: "3", icon: "🛒", name: "Migros",      cat: "Market",   amount: -320,  color: "#E0F7F8" },
  { id: "4", icon: "📱", name: "Netflix",     cat: "Abonelik", amount: -180,  color: "#EDE9FE" },
  { id: "5", icon: "🚌", name: "Metro",       cat: "Ulaşım",   amount: -45,   color: "#E0F7F8" },
];

export function Dashboard({ onLogout }: DashboardProps) {
  const [showExpense, setShowExpense] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  if (showTransactions) {
    return <TransactionList onBack={() => setShowTransactions(false)} />;
  }

  return (
    <div className="dash-root">

      {/* ── Üst Nav ── */}
      <nav className="dash-nav">
        <div className="dash-nav-logo">FiCo AI</div>
        <div className="dash-nav-links">
          <span className="dash-nav-item active">Ana Sayfa</span>
          <span className="dash-nav-item" onClick={() => setShowTransactions(true)}>Giderler</span>
          <span className="dash-nav-item">Gelir</span>
          <span className="dash-nav-item">Hedefler</span>
        </div>
        <div className="dash-nav-right">
          <div className="dash-avatar">HS</div>
          <span className="dash-logout" onClick={onLogout}>Çıkış</span>
        </div>
      </nav>

      <main className="dash-main">

        {/* Karşılama */}
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Merhaba 👋</h1>
            <p className="dash-date">Nisan 2026</p>
          </div>
          <button className="dash-fab" onClick={() => setShowExpense(true)}>
            + Gider Ekle
          </button>
        </div>

        {/* Özet Kartlar */}
        <div className="dash-metrics">
          <div className="dash-metric-card">
            <div className="dash-metric-label">Net Bakiye</div>
            <div className="dash-metric-value">₺2.220</div>
            <div className="dash-metric-trend up">↑ %8 geçen aya göre</div>
          </div>
          <div className="dash-metric-card">
            <div className="dash-metric-label">Toplam Gelir</div>
            <div className="dash-metric-value success">₺3.500</div>
            <div className="dash-metric-trend neutral">Bu ay</div>
          </div>
          <div className="dash-metric-card">
            <div className="dash-metric-label">Toplam Gider</div>
            <div className="dash-metric-value danger">₺1.280</div>
            <div className="dash-metric-trend down">↑ %12 geçen aya göre</div>
          </div>
          <div className="dash-metric-card">
            <div className="dash-metric-label">Kalan Bütçe</div>
            <div className="dash-metric-value">₺2.220</div>
            <div className="dash-metric-trend neutral">6 gün kaldı</div>
          </div>
        </div>

        {/* Bütçe Durum Şeridi */}
        <div className="dash-status-bar">
          <div className="dash-status-label">
            <span>Bütçe Durumu</span>
            <span className="dash-status-badge good">İyi</span>
          </div>
          <div className="dash-progress-track">
            <div className="dash-progress-fill" style={{ width: "37%" }} />
          </div>
          <div className="dash-progress-hint">%37 kullanıldı · ₺1.280 / ₺3.500</div>
        </div>

        {/* Grafik Grid */}
        <div className="dash-grid">

          {/* Haftalık Bar Grafik */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Haftalık Harcama</span>
              <span className="dash-card-link">Son 7 gün</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} barSize={28}>
                <XAxis
                  dataKey="gun"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B4" }}
                />
                <YAxis hide />
                <Tooltip
                formatter={(value: any) => [`₺${value}`, "Harcama"]}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #D9E2E8",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                  cursor={{ fill: "#f0fbfc" }}
                />
                <Bar dataKey="tutar" fill="#0EA5B0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Kategori Pasta Grafik */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Kategoriler</span>
              <span className="dash-card-link">Bu ay</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`₺${value}`, ""]}
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #D9E2E8",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {categoryData.map((cat) => (
                  <div
                    key={cat.name}
                    style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
                  >
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: cat.color, flexShrink: 0
                    }} />
                    <span style={{ fontSize: 12, color: "#4E6478", flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#1E3A5F" }}>
                      ₺{cat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Son İşlemler */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Son İşlemler</span>
              <span className="dash-card-link" onClick={() => setShowTransactions(true)}>
                Tümünü Gör
              </span>
            </div>
            {RECENT.map((tx, i) => (
              <div
                key={tx.id}
                className={`tl-row${i < RECENT.length - 1 ? " bordered" : ""}`}
              >
                <div className="tl-cat-icon" style={{ background: tx.color }}>
                  {tx.icon}
                </div>
                <div className="tl-info">
                  <div className="tl-name">{tx.name}</div>
                  <div className="tl-meta">{tx.cat}</div>
                </div>
                <div className={`tl-amount ${tx.amount < 0 ? "neg" : "pos"}`}>
                  {tx.amount < 0 ? "-" : "+"}₺{Math.abs(tx.amount).toLocaleString("tr-TR")}
                </div>
              </div>
            ))}
          </div>

          {/* AI İçgörü */}
          <div className="dash-card dash-insight-card">
            <div className="dash-card-header">
              <span className="dash-card-title">✨ AI İçgörü</span>
            </div>
            <div style={{ padding: "8px 0 12px" }}>
              <p style={{ fontSize: 14, color: "#1E3A5F", lineHeight: 1.6, marginBottom: 12 }}>
                <strong>Cuma akşamları</strong> harcaman hafta ortasına göre <strong style={{ color: "#EF4444" }}>2.4x</strong> daha yüksek. Bu ay yemek kategorisinde geçen aya göre %18 artış var.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{
                  width: "auto", height: 32, padding: "0 14px",
                  background: "#E0F7F8", color: "#0B8A94",
                  border: "none", borderRadius: 6, fontSize: 13,
                  cursor: "pointer", fontFamily: "DM Sans, sans-serif"
                }}>👍</button>
                <button style={{
                  width: "auto", height: 32, padding: "0 14px",
                  background: "#EFF3F5", color: "#4E6478",
                  border: "none", borderRadius: 6, fontSize: 13,
                  cursor: "pointer", fontFamily: "DM Sans, sans-serif"
                }}>👎</button>
              </div>
            </div>
            <div className="dash-insight-progress">
              <div className="dash-insight-bar">
                <div className="dash-insight-fill" style={{ width: "17%" }} />
              </div>
              <span className="dash-insight-count">5 / 30 işlem</span>
            </div>
          </div>

        </div>

      </main>

      {/* Mobil Alt Nav */}
      <nav className="dash-bottom-nav">
        <div className="dash-bottom-item active">
          <span>🏠</span>
          <span>Ana Sayfa</span>
        </div>
        <div className="dash-bottom-item" onClick={() => setShowTransactions(true)}>
          <span>💸</span>
          <span>Giderler</span>
        </div>
        <div className="dash-bottom-item">
          <span>💰</span>
          <span>Gelir</span>
        </div>
        <div className="dash-bottom-item">
          <span>🎯</span>
          <span>Hedefler</span>
        </div>
        <div className="dash-bottom-item">
          <span>👤</span>
          <span>Profil</span>
        </div>
      </nav>

      {showExpense && (
        <QuickExpense
          onClose={() => setShowExpense(false)}
          onSaved={() => setShowExpense(false)}
        />
      )}

    </div>
  );
}