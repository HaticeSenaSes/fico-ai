**FiCo AI**

Design System

v1.0 | Nisan 2026 | Mobile-first · Web Responsive · TR/EN

_Gizli - Dahili Kullanım_

# **İçindekiler**

# **1\. Genel Bakış / Overview**

Bu doküman, FiCo AI finansal okuryazarlık uygulamasının tasarım sistemini tanımlar. Tüm platform ve bileşenler bu sistemden türetilir; tutarlılık ve hız için tek kaynak olarak kullanılır.

| **Özellik**       | **Değer**                             |
| ----------------- | ------------------------------------- |
| Versiyon          | 1.0                                   |
| Platform          | Web (responsive) + iOS (React Native) |
| Yaklaşım          | Mobile-first                          |
| Dil               | Türkçe + İngilizce                    |
| Framework         | React Native (Expo) / NativeWind      |
| Font              | Inter, system-ui, sans-serif          |
| Base Spacing Unit | 4px                                   |

# **2\. Renk Paleti / Color Palette**

Ana renk: türkuaz-deniz mavisi (#0EA5B0). Yeşile kaymayan, finansal uygulamalarda güven ve enerji dengesi kuran özgün bir ton. Rakip uygulamalardan ayrışır.

## **2.1 Ana Renkler / Primary Colors**

| **Primary**<br><br>#0EA5B0 | **Primary Dark**<br><br>#0B8A94 | **Primary Darker**<br><br>#076E77 | **Primary Light**<br><br>#E0F7F8 | **Primary Lighter**<br><br>#F0FBFC | **Navy**<br><br>#1E3A5F | **White**<br><br>#FFFFFF | **Neutral 50**<br><br>#F8FAFB | **Neutral 100**<br><br>#EFF3F5 |
| -------------------------- | ------------------------------- | --------------------------------- | -------------------------------- | ---------------------------------- | ----------------------- | ------------------------ | ----------------------------- | ------------------------------ |

## **2.2 Semantik Renkler / Semantic Colors**

| **Amber (Accent)**<br><br>#F59E0B | **Accent Light**<br><br>#FEF3C7 | **Success**<br><br>#10B981 | **Success Light**<br><br>#D1FAE5 | **Danger**<br><br>#EF4444 | **Danger Light**<br><br>#FEE2E2 | **Warning**<br><br>#F59E0B | **Neutral 400**<br><br>#94A3B4 | **Neutral 600**<br><br>#4E6478 |
| --------------------------------- | ------------------------------- | -------------------------- | -------------------------------- | ------------------------- | ------------------------------- | -------------------------- | ------------------------------ | ------------------------------ |

## **2.3 Kullanım Kuralları / Usage Rules**

| **Token**                | **Hex**           | **Kullanım Alanı**                              |
| ------------------------ | ----------------- | ----------------------------------------------- |
| \--fico-primary          | #0EA5B0           | CTA buton, aktif navigasyon, link, odak halkası |
| \--fico-primary-dark     | #0B8A94           | Buton hover, vurgulu metin                      |
| \--fico-primary-darker   | #076E77           | Buton active/pressed                            |
| \--fico-primary-light    | #E0F7F8           | Buton secondary bg, badge bg, kart vurgusu      |
| \--fico-primary-lighter  | #F0FBFC           | Sayfa arka planı, hover yüzeyi                  |
| \--fico-secondary (Navy) | #1E3A5F           | Başlık metni, koyu arka plan bölümleri          |
| \--fico-accent (Amber)   | #F59E0B           | AI içgörü vurgusu, önemli bilgi                 |
| \--fico-success          | #10B981           | Gelir, pozitif değişim, başarı durumu           |
| \--fico-danger           | #EF4444           | Gider, negatif değişim, hata, limit aşımı       |
| \--fico-warning          | #F59E0B           | Bütçe uyarısı (%80-100 arası)                   |
| Neutral 50-100           | #F8FAFB / #EFF3F5 | Sayfa ve kart arka planları                     |
| Neutral 400              | #94A3B4           | Placeholder metin, devre dışı durum             |
| Neutral 600              | #4E6478           | İkincil metin, alt başlık                       |
| Neutral 800              | #1E3A5F           | Ana gövde metni                                 |

# **3\. Tipografi / Typography**

Font ailesi: Inter (Google Fonts). Fallback: system-ui, -apple-system, sans-serif. Sadece 2 font ağırlığı kullanılır: 400 (regular) ve 500 (medium). 600/700 kalın görünümü nedeniyle yasaktır.

| **Rol / Role**     | **Boyut / Size** | **Ağırlık / Weight** | **Satır Aralığı** | **Kullanım Örneği**                          |
| ------------------ | ---------------- | -------------------- | ----------------- | -------------------------------------------- |
| Display            | 32px / 2rem      | 500                  | 1.2               | ₺12.450 - ana bakiye gösterimi               |
| H1 / Sayfa Başlığı | 24px / 1.5rem    | 500                  | 1.3               | Merhaba, Sena                                |
| H2 / Bölüm Başlığı | 18px / 1.125rem  | 500                  | 1.4               | Bu Ay Harcamalar                             |
| H3 / Alt Başlık    | 15px / 0.9375rem | 500                  | 1.5               | Yiyecek & İçecek                             |
| Body / Gövde       | 14px / 0.875rem  | 400                  | 1.6               | Bu ay yemek harcamaların artmış.             |
| Body Small         | 13px / 0.8125rem | 400                  | 1.5               | Kart açıklamaları, liste detayı              |
| Caption            | 12px / 0.75rem   | 400                  | 1.5               | Son güncelleme: 24 Nisan 2026                |
| Micro / Label      | 11px / 0.6875rem | 500                  | 1.4               | KATEGORİ ANALİZİ (uppercase, 0.06em spacing) |
| Monospace          | 13px / 0.8125rem | 400                  | 1.5               | API endpoint, token değerleri                |

Kural: Metin hiyerarşisi yalnızca boyut + ağırlık ile kurulur. Renk, metnin önem seviyesini gösterir: Primary (ana içerik) → Secondary (yardımcı) → Tertiary (ipucu/placeholder).

# **4\. Boşluk Sistemi / Spacing System**

4px temel birim. Tüm boşluklar bu birimin katlarıdır. CSS custom properties olarak tanımlanır.

| **Token** | **Değer** | **Tailwind** | **Kullanım Alanı**                |
| --------- | --------- | ------------ | --------------------------------- |
| space-1   | 4px       | p-1 / m-1    | İkon-metin arası, küçük iç boşluk |
| space-2   | 8px       | p-2 / m-2    | Bileşen içi boşluk, badge padding |
| space-3   | 12px      | p-3 / m-3    | Satır arası, input yüksekliği içi |
| space-4   | 16px      | p-4 / m-4    | Kart padding, form elemanı arası  |
| space-5   | 20px      | p-5 / m-5    | Bölüm içi boşluk                  |
| space-6   | 24px      | p-6 / m-6    | Bölüm arası, büyük kart padding   |
| space-8   | 32px      | p-8 / m-8    | Sayfa padding (mobil)             |
| space-10  | 40px      | p-10 / m-10  | Sayfa padding (tablet+)           |
| space-12  | 48px      | p-12 / m-12  | Büyük bölüm arası                 |
| space-16  | 64px      | p-16 / m-16  | Sayfa bölümleri arası (desktop)   |

# **5\. Köşe Yarıçapı / Border Radius**

| **Token**         | **Değer** | **Tailwind** | **Kullanım Alanı**                      |
| ----------------- | --------- | ------------ | --------------------------------------- |
| \--fico-radius-sm | 6px       | rounded-md   | Buton (sm), input, tag, nav item        |
| \--fico-radius-md | 10px      | rounded-xl   | Buton (md/lg), dropdown, tooltip, badge |
| \--fico-radius-lg | 16px      | rounded-2xl  | Kart, modal, bottom sheet, sayfa bölümü |
| \--fico-radius-xl | 24px      | rounded-3xl  | Tam sayfa modal, onboarding kartları    |
| full              | 999px     | rounded-full | Avatar, pill badge, FAB butonu          |

# **6\. Bileşenler / Components**

## **6.1 Butonlar / Buttons**

| **Varyant**    | **bg**      | **Text**     | **Border**            | **Kullanım**                            |
| -------------- | ----------- | ------------ | --------------------- | --------------------------------------- |
| Primary        | #0EA5B0     | white        | none                  | Ana aksiyon (Kaydet, Devam Et, Oluştur) |
| Secondary      | #E0F7F8     | #0B8A94      | none                  | İkincil aksiyon (Filtrele, Düzenle)     |
| Outline        | transparent | #0EA5B0      | 1.5px #0EA5B0         | Üçüncül aksiyon (Detay, İndir)          |
| Ghost          | transparent | neutral-600  | 0.5px border-tertiary | İptal, geri dön                         |
| Danger         | #FEE2E2     | #EF4444      | none                  | Silme, tehlikeli aksiyon                |
| Disabled (tüm) | -           | 0.45 opacity | -                     | Tüm varyantlara uygulanır               |

| **Boyut**    | **Height** | **Padding (yatay)** | **Font Size** | **Kullanım**                        |
| ------------ | ---------- | ------------------- | ------------- | ----------------------------------- |
| sm           | 32px       | 14px                | 12px          | Compact listeler, tablo aksiyonları |
| md (default) | 40px       | 18px                | 14px          | Tüm standart kullanımlar            |
| lg           | 48px       | 24px                | 16px          | Onboarding CTA, tam genişlik buton  |
| full-width   | 48px       | -                   | 16px          | Mobil primary CTA (ekran genişliği) |

## **6.2 Form Elemanları / Form Elements**

| **Durum / State** | **Border**    | **Background** | **Kural**                                   |
| ----------------- | ------------- | -------------- | ------------------------------------------- |
| Default           | 1.5px #D9E2E8 | #FFFFFF        | Placeholder: neutral-400                    |
| Focus             | 1.5px #0EA5B0 | #FFFFFF        | Focus ring: 0 0 0 3px rgba(14,165,176,0.15) |
| Filled            | 1.5px #94A3B4 | #FFFFFF        | Değer girilmiş, aktif değil                 |
| Error             | 1.5px #EF4444 | #FFF8F8        | Hata mesajı altında, kırmızı                |
| Disabled          | 1.5px #EFF3F5 | #F8FAFB        | 0.6 opacity, cursor: not-allowed            |
| Read-only         | 1.5px #EFF3F5 | #F8FAFB        | Düzenlenemez ama kopyalanabilir             |

Tüm input'lar için: yükseklik 40px, border-radius 6px (sm), padding yatay 12px. Label: 12px/500, gri-600. Hint/hata: 11px, hint için gri-400, hata için danger rengi.

## **6.3 Kartlar / Cards**

| **Tip**     | **Background**     | **Border**               | **Radius** | **Shadow** | **Kullanım**                  |
| ----------- | ------------------ | ------------------------ | ---------- | ---------- | ----------------------------- |
| Standard    | bg-primary (white) | 0.5px border-tertiary    | lg (16px)  | none       | Gider listesi, içgörü, hedef  |
| Metric      | bg-secondary       | none                     | md (10px)  | none       | Dashboard özet rakamları      |
| Accent (AI) | white              | 0.5px + 3px left primary | 0 / lg sağ | none       | AI içgörü kartları            |
| Filled      | #0EA5B0            | none                     | lg (16px)  | none       | Bakiye kartı, öne çıkan bilgi |
| Filled Dark | #1E3A5F            | none                     | lg (16px)  | none       | Koyu tema bölümleri           |

## **6.4 Rozetler / Badges**

| **Varyant** | **Background** | **Text Rengi** | **Kullanım**                      |
| ----------- | -------------- | -------------- | --------------------------------- |
| primary     | #E0F7F8        | #0B8A94        | AI içgörü, aktif özellik, premium |
| success     | #D1FAE5        | #065f46        | Gelir, tamamlanan hedef, onay     |
| danger      | #FEE2E2        | #991b1b        | Gider, limit aşımı, hata          |
| warning     | #FEF3C7        | #92400e        | Uyarı, yaklaşan limit             |
| neutral     | bg-secondary   | text-secondary | Tekrarlayan, taslak, kategori     |

Tüm badge'ler: font-size 11px, font-weight 500, padding 3px 8px, border-radius 20px (pill).

## **6.5 İlerleme Çubuğu / Progress Bar**

| **Durum** | **Renk**          | **Eşik**       | **Bildirim**            |
| --------- | ----------------- | -------------- | ----------------------- |
| İyi       | #0EA5B0 (primary) | < %70 kullanım | Yok                     |
| Dikkat    | #F59E0B (warning) | %70-%90 arası  | Opsiyonel in-app        |
| Uyarı     | #F59E0B (warning) | %90-%100 arası | Push notification       |
| Aşıldı    | #EF4444 (danger)  | \> %100        | Push + dashboard banner |

Track: 8px yükseklik, bg-secondary, border-radius 20px. Fill: aynı yükseklik, renk duruma göre. Animasyon: width transition 0.4s ease.

## **6.6 Navigasyon / Navigation**

| **Tip**             | **Breakpoint** | **Yükseklik**    | **Öğeler**                                   | **Not**                                   |
| ------------------- | -------------- | ---------------- | -------------------------------------------- | ----------------------------------------- |
| Top Nav (web)       | \>= 768px      | 56px             | Logo, ana menü linkleri, avatar              | Sticky, bg-primary (white), border-bottom |
| Bottom Tab (mobil)  | < 768px        | 60px + safe area | Ana Sayfa, Giderler, Gelir, Hedefler, Profil | FAB ortaya eklenir                        |
| Side Drawer (mobil) | Hamburger ile  | tam ekran        | Tüm menü öğeleri                             | Overlay, sağdan girer                     |

Aktif nav item: bg primary-light (#E0F7F8), text primary-dark, font-weight 500. İnaktif: text secondary. Hover: bg secondary. Geçiş: 150ms ease.

## **6.7 Toast & Bildirimler / Notifications**

| **Tip** | **Sol Kenarlık** | **İkon Rengi** | **Örnek Mesaj**                                  |
| ------- | ---------------- | -------------- | ------------------------------------------------ |
| success | #10B981          | yeşil          | Gider kaydedildi · ₺85 Kafe kategorisine eklendi |
| warning | #F59E0B          | amber          | Bütçe uyarısı · Eğlence kategorisi %90 doldu     |
| danger  | #EF4444          | kırmızı        | Limit aşıldı · Ulaşım bütçen ₺40 aşıldı          |
| info    | #0EA5B0          | primary        | Yeni AI içgörü · Haftalık harcama özeti hazır    |

Toast pozisyonu: sağ üst (web), üst merkez (mobil). Otomatik kapanma: 4 saniye. Yapı: white bg, 0.5px border-tertiary, border-radius md, border-left 3px renkli, padding 12px 16px.

# **7\. CSS Token Referansı**

theme.ts dosyasına veya tailwind.config.js extend bölümüne eklenecek tam token listesi:

| **Token**               | **Değer**                    | **Açıklama**        |
| ----------------------- | ---------------------------- | ------------------- |
| \--fico-primary         | #0EA5B0                      | Ana marka rengi     |
| \--fico-primary-dark    | #0B8A94                      | Hover/vurgu         |
| \--fico-primary-darker  | #076E77                      | Active/pressed      |
| \--fico-primary-light   | #E0F7F8                      | Light fill          |
| \--fico-primary-lighter | #F0FBFC                      | Subtle bg           |
| \--fico-secondary       | #1E3A5F                      | Navy / koyu başlık  |
| \--fico-accent          | #F59E0B                      | Amber / AI vurgu    |
| \--fico-accent-light    | #FEF3C7                      | Amber light fill    |
| \--fico-success         | #10B981                      | Başarı / gelir      |
| \--fico-success-light   | #D1FAE5                      | Başarı light fill   |
| \--fico-danger          | #EF4444                      | Hata / gider        |
| \--fico-danger-light    | #FEE2E2                      | Hata light fill     |
| \--fico-warning         | #F59E0B                      | Uyarı               |
| \--fico-warning-light   | #FEF3C7                      | Uyarı light fill    |
| \--fico-neutral-50      | #F8FAFB                      | Sayfa zemin         |
| \--fico-neutral-100     | #EFF3F5                      | Kart zemin          |
| \--fico-neutral-200     | #D9E2E8                      | Bölücü / border     |
| \--fico-neutral-400     | #94A3B4                      | Placeholder         |
| \--fico-neutral-600     | #4E6478                      | İkincil metin       |
| \--fico-neutral-800     | #1E3A5F                      | Ana metin           |
| \--fico-neutral-900     | #0F1E30                      | Başlık / koyu metin |
| \--fico-font            | Inter, system-ui, sans-serif | Font ailesi         |
| \--fico-radius-sm       | 6px                          | Buton, input        |
| \--fico-radius-md       | 10px                         | Kart, dropdown      |
| \--fico-radius-lg       | 16px                         | Sayfa kartı, modal  |
| \--fico-radius-xl       | 24px                         | Tam ekran modal     |

# **8\. Responsive Breakpoints**

| **İsim**     | **Genişlik**    | **Cihaz**                   | **Davranış**                                 |
| ------------ | --------------- | --------------------------- | -------------------------------------------- |
| xs (default) | < 480px         | iPhone SE, küçük telefonlar | Tek kolon, bottom tab nav, FAB görünür       |
| sm           | 480px - 767px   | Büyük telefonlar            | Tek kolon, spacing artışı                    |
| md           | 768px - 1023px  | Tablet, küçük laptop        | Üst nav aktif, 2 kolon grid                  |
| lg           | 1024px - 1279px | Laptop                      | Sidebar opsiyonel, 3 kolon grid              |
| xl           | \>= 1280px      | Desktop                     | Tam layout, sidebar sabit, max-width: 1440px |

max-width container: 1440px, ortalanmış. Sayfa padding: 16px (xs) → 24px (sm) → 32px (md) → 48px (lg+). Grid: 1 kolon (mobil) → 2 kolon (tablet) → 3 kolon (desktop).

# **9\. İkon Sistemi / Icon System**

Kütüphane: Lucide React Native (React Native için) / Lucide React (web için). Boyutlar standartlaştırılmıştır.

| **Boyut**    | **px** | **Kullanım**                      |
| ------------ | ------ | --------------------------------- |
| xs           | 14px   | Badge içi ikon, küçük inline ikon |
| sm           | 16px   | Buton içi ikon, liste satırı      |
| md (default) | 20px   | Navigasyon ikonu, kart header     |
| lg           | 24px   | Sayfa header, FAB içi             |
| xl           | 32px   | Boş state illüstrasyon            |
| 2xl          | 48px   | Onboarding, hata sayfası          |

Kural: İkon rengi her zaman içinde bulunduğu bileşenin metin rengiyle aynı olur. Stroke width: 1.5px (standart), 2px (vurgu/aktif durum). Fill kullanılmaz.

# **10\. Hareket & Animasyon / Motion**

| **Token**        | **Değer**                         | **Kullanım**                |
| ---------------- | --------------------------------- | --------------------------- |
| \--duration-fast | 100ms                             | Hover, focus ring           |
| \--duration-base | 150ms                             | Buton press, toggle         |
| \--duration-slow | 250ms                             | Modal open, dropdown        |
| \--duration-page | 300ms                             | Sayfa geçişi, bottom sheet  |
| \--ease-default  | cubic-bezier(0.4, 0, 0.2, 1)      | Genel geçiş (Material ease) |
| \--ease-spring   | cubic-bezier(0.34, 1.56, 0.64, 1) | Kutlama, başarı animasyonu  |
| \--ease-out      | cubic-bezier(0, 0, 0.2, 1)        | Ekran açılması, slide-in    |
| \--ease-in       | cubic-bezier(0.4, 0, 1, 1)        | Ekran kapanması, slide-out  |

Kural: Animasyon bilgi taşır; dekoratif animasyon kullanılmaz. Başarı durumunda konfeti (500ms, ease-spring). Skeleton loading: pulse animasyonu, 1.5s döngü. prefers-reduced-motion: tüm animasyonlar devre dışı.

# **11\. Erişilebilirlik / Accessibility**

| **Kural**              | **Standart**           | **Uygulama**                                                                                      |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| Renk kontrastı (metin) | WCAG AA (4.5:1)        | Primary (#0EA5B0) beyaz üzerinde: 3.2:1 → koyu bg'de kullanılmalı; white metin primary üzerinde ✓ |
| Renk kontrastı (UI)    | WCAG AA (3:1)          | Tüm buton, input, badge border kontrastı sağlanır                                                 |
| Focus göstergesi       | WCAG 2.1               | Focus ring: 3px, primary rengi, tüm interaktif öğelerde                                           |
| Touch hedefi           | iOS HIG                | Minimum 44x44px dokunma alanı                                                                     |
| Screen reader          | VoiceOver (iOS)        | accessibilityLabel tüm ikonlara eklenir                                                           |
| Dinamik metin          | iOS Dynamic Type       | scalable font size, rem birimleri                                                                 |
| Hareket hassasiyeti    | prefers-reduced-motion | Animasyonlar devre dışı bırakılır                                                                 |
| Renk körlüğü           | Renk + şekil/ikon      | Bilgi yalnızca renkle iletilmez                                                                   |

# **12\. Yapılacaklar & Yapılmayacaklar / Do & Don't**

## **Yapılacaklar / Do**

- Primary rengi CTA ve aktif durum için kullan
- Mobil-first yaz: 320px'den başla, yukarı doğru genişlet
- Boşluk için her zaman space tokenlarını kullan (4px katları)
- Gelir için success yeşil, gider için danger kırmızı kullan (evrensel finans konvansiyonu)
- Amber'i yalnızca AI içgörü ve önemli vurgu için kullan
- Tüm interaktif öğelerde focus durumu tanımla
- Rengi tek başına bilgi iletmek için kullanma, ikon veya metin ile destekle
- Toast mesajlarını 4 saniye sonra otomatik kapat

## **Yapılmayacaklar / Don't**

- Font-weight 600 veya 700 kullanma - 500 maksimum
- Gradient, shadow veya blur efekti ekleme (aksiyon ringi hariç)
- Navy'i (#1E3A5F) yüzey rengi olarak kullanma, sadece metin/koyu bölüm
- Farklı amaçlar için primary rengi sulandırma - her kullanım anlamlı olsun
- 5'ten fazla renk bir ekranda gösterme
- Border radius için tasarım sisteminde tanımsız değer kullanma
- Sadece renkle hata/başarı/uyarı durumu gösterme

# **13\. Doküman Geçmişi**

| **Versiyon** | **Tarih**  | **Yazar** | **Değişiklikler**                                                                                            |
| ------------ | ---------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| v1.0         | Nisan 2026 | Teknik PO | İlk yayın - renk paleti, tipografi, boşluk, 7 bileşen, token referansı, breakpoint, erişilebilirlik kılavuzu |