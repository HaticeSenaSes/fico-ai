# Design System

## Renk Paleti

| Renk | Hex | Kullanım |
|---|---|---|
| Primary (Teal) | `#0EA5B0` | Ana aksiyon rengi, butonlar, aktif sekme |
| Primary Light | `#E0F7F8` | Seçili kart arka planları |
| Primary Dark | `#0B8A94` | Vurgulu metinler |
| Navy | `#1E3A5F` | Başlıklar, ana metin |
| Background | `#F0FBFC` | Ekran arka planı |
| Border | `#D9E2E8` | Kart kenarlıkları |
| Text Secondary | `#4E6478` | İkincil metinler |
| Text Muted | `#94A3B4` | Placeholder, yardımcı metin |
| Success | `#10B981` | Gelir, pozitif değerler |
| Danger | `#EF4444` | Gider, uyarılar |
| Warning | `#F59E0B` | Bütçe uyarı durumu |
| White | `#FFFFFF` | Kart yüzeyleri |
| Neutral | `#EFF3F5` | Hafif gri yüzeyler, progress track |

## Tipografi

- Başlıklar: 16-18px, `fontWeight: 600`
- Gövde metni: 13-14px, `fontWeight: 400-500`
- Büyük rakamlar (bakiye): 36-40px, `fontWeight: 600`
- Yardımcı metin: 10-12px

## Bileşen Kuralları

- **Kartlar**: `borderRadius: 16`, `borderWidth: 1`, `borderColor: border`
- **Butonlar**: `height: 48-52`, `borderRadius: 8-12`
- **Kategori ikonları**: emoji tabanlı, 40x40px container, `borderRadius: 10`
- **Progress bar**: `height: 8`, `borderRadius: 99`, renk bütçe durumuna göre dinamik (primary/warning/danger)
- **Bottom navigation**: 5 sekme (Ana Sayfa, Giderler, Gelir, Hedefler, Profil), aktif sekme primary renk + alt nokta gösterge

## Dil ve Ton

Tüm arayüz Türkçe. Samimi ama bilgilendirici bir dil (örn. "Henüz işlem yok, FAB ile ilk işlemini ekle").
