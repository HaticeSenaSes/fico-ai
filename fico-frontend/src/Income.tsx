import { useState } from "react";

type Props = { onBack: () => void };

const SOURCES = [
  { id: "1", name: "Burs", type: "Burs", amount: 3500, frequency: "Aylık", active: true },
  { id: "2", name: "Harçlık", type: "Harçlık", amount: 2000, frequency: "Aylık", active: true },
  { id: "3", name: "Part-time", type: "Part-time", amount: 1500, frequency: "Aylık", active: false },
];

const HISTORY = [
  { id: "1", source: "Burs", amount: 3500, date: "2026-04-01", note: "Nisan bursu" },
  { id: "2", source: "Harçlık", amount: 2000, date: "2026-04-05", note: "Nisan harçlığı" },
  { id: "3", source: "Burs", amount: 3500, date: "2026-03-01", note: "Mart bursu" },
  { id: "4", source: "Harçlık", amount: 2000, date: "2026-03-05", note: "Mart harçlığı" },
];

export function Income({ onBack }: Props) {
  const [sources, setSources] = useState(SOURCES);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState("burs");
  const [confirmed, setConfirmed] = useState<string[]>([]);

  const thisMonth = HISTORY.filter(h =>
    h.date.startsWith("2026-04")
  );
  const totalThisMonth = thisMonth.reduce((s, h) => s + h.amount, 0);

  const byMonth: Record<string, typeof HISTORY> = {};
  for (const h of HISTORY) {
    const key = h.date.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(h);
  }

  const toggleConfirm = (id: string) => {
    setConfirmed(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleActive = (id: string) => {
    setSources(prev =>
      prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
    );
  };

  return (
    <div className="dash-root">
      <nav className="dash-nav">
        <div className="dash-nav-logo">FiCo AI</div>
        <div className="dash-nav-links">
          <span className="dash-nav-item" onClick={onBack}>Ana Sayfa</span>
          <span className="dash-nav-item">Giderler</span>
          <span className="dash-nav-item active">Gelir</span>
          <span className="dash-nav-item">Hedefler</span>
        </div>
        <div className="dash-nav-right">
          <div className="dash-avatar">HS</div>
        </div>
      </nav>

      <main className="dash-main">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Gelir Yönetimi</h1>
            <p className="dash-date">Bu ay toplam</p>
          </div>
          <button className="dash-fab" onClick={() => setShowAdd(true)}>
            + Kaynak Ekle
          </button>
        </div>

        {/* Bu ay özet */}
        <div className="inc-summary-card">
          <div className="inc-summary-amount">₺{totalThisMonth.toLocaleString("tr-TR")}</div>
          <div className="inc-summary-label">Nisan 2026 toplam gelir</div>
          <div className="inc-summary-sources">{thisMonth.length} kaynaktan</div>
        </div>

        {/* Bu ay aldım mı? */}
        <div className="dash-card" style={{ marginBottom: 12 }}>
          <div className="dash-card-header">
            <span className="dash-card-title">Bu Ay Aldım Mı?</span>
            <span style={{ fontSize: 11, color: "#94A3B4" }}>Nisan 2026</span>
          </div>
          {sources.filter(s => s.active).map(s => (
            <div key={s.id} className="inc-confirm-row">
              <div className="inc-confirm-info">
                <div className="inc-confirm-name">{s.name}</div>
                <div className="inc-confirm-amount">₺{s.amount.toLocaleString("tr-TR")} · {s.frequency}</div>
              </div>
              <button
                className={`inc-confirm-btn${confirmed.includes(s.id) ? " confirmed" : ""}`}
                onClick={() => toggleConfirm(s.id)}
              >
                {confirmed.includes(s.id) ? "✓ Alındı" : "Aldım"}
              </button>
            </div>
          ))}
        </div>

        {/* Gelir kaynakları */}
        <div className="dash-card" style={{ marginBottom: 12 }}>
          <div className="dash-card-header">
            <span className="dash-card-title">Gelir Kaynakları</span>
          </div>
          {sources.map(s => (
            <div key={s.id} className="inc-source-row">
              <div className="inc-source-icon">💰</div>
              <div className="inc-source-info">
                <div className="inc-source-name">{s.name}</div>
                <div className="inc-source-meta">{s.type} · {s.frequency} · ₺{s.amount.toLocaleString("tr-TR")}</div>
              </div>
              <label className="inc-toggle">
                <input
                  type="checkbox"
                  checked={s.active}
                  onChange={() => toggleActive(s.id)}
                />
                <span className="inc-toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        {/* Geçmiş */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Gelir Geçmişi</span>
          </div>
          {Object.entries(byMonth).sort((a, b) => b[0].localeCompare(a[0])).map(([month, entries]) => (
            <div key={month} className="tl-group">
              <div className="tl-group-header">
                <span>{month === "2026-04" ? "Nisan 2026" : "Mart 2026"}</span>
                <span className="tl-group-total pos">
                  +₺{entries.reduce((s, e) => s + e.amount, 0).toLocaleString("tr-TR")}
                </span>
              </div>
              {entries.map((e, i) => (
                <div key={e.id} className={`tl-row${i < entries.length - 1 ? " bordered" : ""}`}>
                  <div className="tl-cat-icon" style={{ background: "#D1FAE5" }}>💰</div>
                  <div className="tl-info">
                    <div className="tl-name">{e.note}</div>
                    <div className="tl-meta">{e.source} · {new Date(e.date).toLocaleDateString("tr-TR")}</div>
                  </div>
                  <div className="tl-amount pos">+₺{e.amount.toLocaleString("tr-TR")}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </main>

      {/* Mobil alt nav */}
      <nav className="dash-bottom-nav">
        <div className="dash-bottom-item" onClick={onBack}><span>🏠</span><span>Ana Sayfa</span></div>
        <div className="dash-bottom-item"><span>💸</span><span>Giderler</span></div>
        <div className="dash-bottom-item active"><span>💰</span><span>Gelir</span></div>
        <div className="dash-bottom-item"><span>🎯</span><span>Hedefler</span></div>
        <div className="dash-bottom-item"><span>👤</span><span>Profil</span></div>
      </nav>

      {/* Kaynak ekleme modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-header">
              <h2 className="modal-title">Gelir Kaynağı Ekle</h2>
              <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <select
              className="tl-sort"
              style={{ width: "100%", marginBottom: 12, height: 44 }}
              value={newType}
              onChange={e => setNewType(e.target.value)}
            >
              <option value="burs">Burs</option>
              <option value="harçlık">Harçlık</option>
              <option value="part_time">Part-time</option>
              <option value="serbest">Serbest</option>
              <option value="diger">Diğer</option>
            </select>
            <input
              type="text"
              placeholder="Kaynak adı"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Aylık tutar (₺)"
              value={newAmount}
              onChange={e => setNewAmount(e.target.value)}
            />
            <button onClick={() => {
              if (newName && newAmount) {
                setSources(prev => [...prev, {
                  id: Date.now().toString(),
                  name: newName,
                  type: newType,
                  amount: parseFloat(newAmount),
                  frequency: "Aylık",
                  active: true,
                }]);
                setShowAdd(false);
                setNewName("");
                setNewAmount("");
              }
            }}>
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}