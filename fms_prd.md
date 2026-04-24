# FiCo AI — MVP Ürün Gereksinimleri Dokümanı

| Alan | Değer |
|---|---|
| Platform | Web uygulaması (responsive, mobile-first) |
| Frontend | React + Zustand + Recharts + Lucide React |
| Backend | FastAPI (Python 3.11+) |
| Veritabanı | PostgreSQL 15 |
| AI Provider | Anthropic Claude API |
| Para Birimi | TRY (₺) |
| Durum | Geliştirmeye Hazır |

---

## İçindekiler

1. [Mimari Karar Kayıtları (ADR)](#1-mimari-karar-kayıtları-adr)
2. [Veri Modeli](#2-veri-modeli)
3. [API Kontrat](#3-api-kontrat)
4. [Ekran Kataloğu](#4-ekran-kataloğu)
5. [User Storyler ve Kabul Kriterleri](#5-user-storyler-ve-kabul-kriterleri)
6. [Definition of Done](#6-definition-of-done)
7. [Hata ve Edge Case Kataloğu](#7-hata-ve-edge-case-kataloğu)
8. [AI İçgörü Motoru](#8-ai-içgörü-motoru)
9. [Performans ve Güvenlik](#9-performans-ve-güvenlik)
10. [Sprint Planı](#10-sprint-planı)
11. [Sözlük](#11-sözlük)

---

## 1. Mimari Karar Kayıtları (ADR)

| ADR # | Karar Konusu | Karar | Gerekçe |
|---|---|---|---|
| ADR-001 | Frontend | React + Vite + TypeScript | Web-first yaklaşım. Cursor ile en olgun geliştirme desteği. |
| ADR-002 | Backend | FastAPI (Python 3.11+) | Async desteği, otomatik OpenAPI dökümantasyonu, Pydantic tip güvenliği. |
| ADR-003 | Veritabanı | PostgreSQL 15 | İlişkisel model finans domain'ine uygun. JSONB AI rule_data için kullanılır. |
| ADR-004 | State Yönetimi | Zustand + React Query | Zustand: global UI state. React Query: server state, cache, background sync. |
| ADR-005 | Auth | JWT (access 15dk, refresh 30gün) | Stateless, ölçeklenebilir. OAuth için python-social-auth. |
| ADR-006 | AI Provider | Anthropic Claude API | Hibrit: kural motoru veri hesaplar, Claude yalnızca doğal dil metni yazar. |
| ADR-007 | Offline | localStorage queue | Service worker alternatifi daha karmaşık. localStorage + sync-on-connect yeterli. |
| ADR-008 | Admin Paneli | MVP'ye dahil (/admin route) | Kullanıcı büyümesi izlenmeden ürün iterate edilemez. |
| ADR-009 | Dosya Depolama | AWS S3 | Makbuz görselleri için. CloudFront CDN. Max 5MB/görsel. |
| ADR-010 | Monetizasyon | Faz 1 tamamen ücretsiz | 30 günlük retention verisi toplanmadan premium karar verilemez. |

---

## 2. Veri Modeli

Tüm tablolarda soft delete uygulanır. UUID primary key standardı. Tüm timestamp'ler TIMESTAMPTZ (UTC).

### Tablo: users

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() |
| email | VARCHAR(255) | UNIQUE NOT NULL |
| email_verified_at | TIMESTAMPTZ | NULLABLE |
| password_hash | VARCHAR(255) | NULLABLE (OAuth için) |
| full_name | VARCHAR(100) | NOT NULL |
| avatar_url | VARCHAR(500) | NULLABLE |
| university | VARCHAR(150) | NULLABLE |
| city | VARCHAR(100) | NULLABLE |
| study_year | SMALLINT | 1-7 |
| currency_code | CHAR(3) | DEFAULT 'TRY' |
| role | ENUM | 'user', 'admin' — DEFAULT 'user' |
| app_lock_enabled | BOOLEAN | DEFAULT false |
| onboarding_completed_at | TIMESTAMPTZ | NULLABLE |
| kvkk_accepted_at | TIMESTAMPTZ | NOT NULL |
| delete_requested_at | TIMESTAMPTZ | NULLABLE (30 gün geri dönüş) |
| is_deleted | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

### Tablo: transactions

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id NOT NULL |
| type | ENUM | 'expense', 'income' |
| amount | NUMERIC(12,2) | NOT NULL, CHECK > 0 |
| currency_code | CHAR(3) | DEFAULT 'TRY' |
| category_id | UUID | FK → categories.id NOT NULL |
| sub_category_id | UUID | FK → categories.id NULLABLE |
| note | VARCHAR(100) | NULLABLE |
| receipt_url | VARCHAR(500) | NULLABLE |
| transaction_at | TIMESTAMPTZ | NOT NULL |
| recurring_id | UUID | FK → recurring_expenses.id NULLABLE |
| is_deleted | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

### Tablo: categories

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id NULLABLE (NULL = sistem kategorisi) |
| parent_id | UUID | FK → categories.id NULLABLE (alt kategori) |
| name | VARCHAR(100) | NOT NULL |
| icon | VARCHAR(50) | Lucide icon adı, NOT NULL |
| color | CHAR(7) | HEX renk kodu |
| is_system | BOOLEAN | DEFAULT false |
| is_hidden | BOOLEAN | DEFAULT false |
| sort_order | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### Tablo: income_sources

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| source_type | ENUM | 'burs','harçlık','part_time','serbest','diger' |
| default_amount | NUMERIC(12,2) | NULLABLE |
| frequency | ENUM | 'monthly','one_time','irregular' |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### Tablo: recurring_expenses

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| amount | NUMERIC(12,2) | NOT NULL |
| category_id | UUID | FK → categories.id NOT NULL |
| period | ENUM | 'weekly', 'monthly' |
| next_due_date | DATE | NOT NULL |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### Tablo: goals

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| goal_type | ENUM | 'spending_limit','saving','category_limit','general_budget' |
| target_amount | NUMERIC(12,2) | NOT NULL |
| category_id | UUID | FK → categories.id NULLABLE |
| period_type | ENUM | 'monthly','weekly','custom' |
| period_start | DATE | NOT NULL |
| period_end | DATE | NOT NULL |
| is_active | BOOLEAN | DEFAULT true |
| completed_at | TIMESTAMPTZ | NULLABLE |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### Tablo: ai_insights

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id NOT NULL |
| insight_type | ENUM | 'pattern','anomaly','projection','weekly_summary' |
| title | VARCHAR(150) | NOT NULL |
| body | TEXT | NOT NULL — Claude API çıktısı |
| rule_data | JSONB | Kural motoru ham verisi |
| is_positive_feedback | BOOLEAN | NULLABLE |
| shown_at | TIMESTAMPTZ | NULLABLE |
| expires_at | TIMESTAMPTZ | NULLABLE |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### Tablo: notifications

| Kolon | Tip | Kısıt |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id NOT NULL |
| type | ENUM | 'daily_reminder','goal_alert','recurring_due','weekly_summary','anomaly' |
| title | VARCHAR(150) | NOT NULL |
| body | TEXT | NOT NULL |
| is_read | BOOLEAN | DEFAULT false |
| scheduled_at | TIMESTAMPTZ | NOT NULL |
| sent_at | TIMESTAMPTZ | NULLABLE |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### İndeksler

| İndeks | Tablo | Kolonlar | Amaç |
|---|---|---|---|
| idx_tx_user_date | transactions | (user_id, transaction_at DESC) | Dashboard, listeleme |
| idx_tx_user_category | transactions | (user_id, category_id) | Kategori aggregation |
| idx_tx_soft_delete | transactions | (user_id, is_deleted) | Soft delete filtresi |
| idx_goals_user_active | goals | (user_id, is_active) | Aktif hedef sorgusu |
| idx_insights_user_type | ai_insights | (user_id, insight_type, created_at DESC) | İçgörü listeleme |
| idx_recurring_due | recurring_expenses | (next_due_date, is_active) | Cron job sorgusu |
| idx_notifications_unread | notifications | (user_id, is_read, scheduled_at) | Okunmamış bildirim |

---

## 3. API Kontrat

**Base URL:** `/api/v1/`
**Auth:** `Authorization: Bearer <JWT>`
**Rate limit:** 100 req/dk kullanıcı başına
**Swagger UI:** `/docs`

### 3.1 Auth

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| POST | /auth/register | Hayır | `{email, password, full_name, kvkk_accepted}` | `{access_token, refresh_token, user}` |
| POST | /auth/login | Hayır | `{email, password}` | `{access_token, refresh_token, user}` |
| POST | /auth/oauth/google | Hayır | `{id_token}` | `{access_token, refresh_token, user}` |
| POST | /auth/oauth/apple | Hayır | `{identity_token, authorization_code}` | `{access_token, refresh_token, user}` |
| POST | /auth/refresh | Hayır | `{refresh_token}` | `{access_token}` |
| POST | /auth/logout | Evet | — | `{success: true}` |
| POST | /auth/password/forgot | Hayır | `{email}` | `{success: true}` |
| POST | /auth/password/reset | Hayır | `{token, new_password}` | `{success: true}` |

### 3.2 Kullanıcı

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /users/me | Evet | — | `{user}` |
| PATCH | /users/me | Evet | `{full_name?, avatar_url?, university?, city?, study_year?, currency_code?}` | `{user}` |
| DELETE | /users/me | Evet | `{password}` | `{delete_scheduled_at}` |
| POST | /users/me/cancel-deletion | Evet | — | `{success: true}` |
| POST | /onboarding/complete | Evet | `{monthly_income, income_sources[], preferred_categories[], goal_type, notification_time}` | `{success: true}` |

### 3.3 İşlemler (Gider & Gelir)

| Method | Endpoint | Auth | Request / Query | Response |
|---|---|---|---|---|
| GET | /transactions | Evet | `?type, category_id, start_date, end_date, min_amount, max_amount, search, sort, page, limit` | `{data:[], meta:{total,page,limit}}` |
| POST | /transactions | Evet | `{type, amount, category_id, sub_category_id?, note?, transaction_at, recurring_id?}` | `{transaction}` |
| GET | /transactions/:id | Evet | — | `{transaction}` |
| PATCH | /transactions/:id | Evet | Değişen alanlar | `{transaction}` |
| DELETE | /transactions/:id | Evet | — | `{success: true}` |
| POST | /transactions/bulk-delete | Evet | `{ids:[]}` | `{deleted_count}` |

### 3.4 Gelir Kaynakları

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /income/sources | Evet | — | `{sources:[]}` |
| POST | /income/sources | Evet | `{name, source_type, default_amount?, frequency}` | `{source}` |
| PATCH | /income/sources/:id | Evet | Değişen alanlar | `{source}` |
| DELETE | /income/sources/:id | Evet | — | `{success: true}` |

### 3.5 Kategoriler

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /categories | Evet | — | `{categories:[]}` |
| POST | /categories | Evet | `{name, icon, color, parent_id?}` | `{category}` |
| PATCH | /categories/:id | Evet | Değişen alanlar | `{category}` |
| DELETE | /categories/:id | Evet | — | `{migrated_count}` |

### 3.6 Tekrarlayan Giderler

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /recurring | Evet | — | `{items:[]}` |
| POST | /recurring | Evet | `{name, amount, category_id, period}` | `{item}` |
| PATCH | /recurring/:id | Evet | Değişen alanlar | `{item}` |
| DELETE | /recurring/:id | Evet | — | `{success: true}` |

### 3.7 Dashboard

| Method | Endpoint | Auth | Query | Response |
|---|---|---|---|---|
| GET | /dashboard/summary | Evet | `?month, year` | `{net_balance, total_income, total_expense, daily_average, remaining_budget, remaining_days, status_color, top_categories:[]}` |
| GET | /dashboard/chart/weekly | Evet | — | `{days:[], daily_average}` |
| GET | /dashboard/chart/category | Evet | `?month, year` | `{categories:[], total}` |
| GET | /dashboard/recent | Evet | — | `{transactions:[]}` |

### 3.8 Hedefler

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /goals | Evet | `?is_active` | `{goals:[]}` |
| POST | /goals | Evet | `{name, goal_type, target_amount, category_id?, period_type, period_start, period_end}` | `{goal}` |
| GET | /goals/:id | Evet | — | `{goal, progress:{current_amount, percentage, remaining_amount, days_left}}` |
| PATCH | /goals/:id | Evet | Değişen alanlar | `{goal}` |
| DELETE | /goals/:id | Evet | — | `{success: true}` |

### 3.9 AI İçgörü

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /insights | Evet | `?type, limit` | `{insights:[]}` |
| GET | /insights/latest | Evet | — | `{insight}` |
| POST | /insights/:id/feedback | Evet | `{is_positive: bool}` | `{success: true}` |

### 3.10 Bildirimler

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /notifications | Evet | `?is_read` | `{notifications:[]}` |
| PATCH | /notifications/:id/read | Evet | — | `{success: true}` |
| PATCH | /notifications/read-all | Evet | — | `{success: true}` |
| PATCH | /notifications/preferences | Evet | `{daily_reminder_enabled, daily_reminder_time, weekly_summary_enabled, goal_alerts_enabled}` | `{preferences}` |

### 3.11 Admin (`/admin` prefix, role:admin zorunlu)

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| GET | /admin/users | Admin | `?search, status, page, limit` | `{users:[], meta:{total}}` |
| GET | /admin/users/:id | Admin | — | `{user, stats:{total_transactions, total_income, total_expense}}` |
| PATCH | /admin/users/:id/status | Admin | `{is_active: bool}` | `{user}` |
| DELETE | /admin/users/:id | Admin | — | `{success: true}` (hard delete) |
| GET | /admin/metrics | Admin | `?period` | `{active_users, new_users_today, total_transactions_today, popular_categories:[]}` |
| GET | /admin/categories | Admin | — | `{categories:[]}` |
| POST | /admin/categories | Admin | `{name, icon, color}` | `{category}` |
| PATCH | /admin/categories/:id | Admin | Değişen alanlar | `{category}` |
| DELETE | /admin/categories/:id | Admin | — | `{success: true}` |

### 3.12 Hata Kodları

| HTTP | Kod | Response |
|---|---|---|
| 400 | VALIDATION_ERROR | `{"error":{"code":"VALIDATION_ERROR","fields":{"email":"Geçersiz format"}}}` |
| 401 | UNAUTHORIZED | `{"error":{"code":"UNAUTHORIZED"}}` |
| 403 | FORBIDDEN | `{"error":{"code":"FORBIDDEN"}}` |
| 404 | NOT_FOUND | `{"error":{"code":"NOT_FOUND","resource":"transaction"}}` |
| 409 | CONFLICT | `{"error":{"code":"CONFLICT","field":"email"}}` |
| 429 | RATE_LIMIT | `{"error":{"code":"RATE_LIMIT","retry_after":60}}` |
| 500 | INTERNAL_ERROR | `{"error":{"code":"INTERNAL_ERROR","trace_id":"xxx"}}` |
| 503 | AI_UNAVAILABLE | `{"error":{"code":"AI_UNAVAILABLE","fallback":true}}` |

---

## 4. Ekran Kataloğu

### SCR-001 — Splash / Yükleme
**Route:** `/`

Token kontrolü yapılır, yönlendirme kararı verilir.

**Bileşenler:**
- FiCo AI logosu (merkez, animasyonlu)
- Yükleme spinner
- Versiyon numarası (sağ alt)

**Aksiyonlar:**
- Token geçerli → `/dashboard`
- Token yok → `/welcome`
- Token süresi dolmuş → `/login`

**Hata:** Ağ yok + cache var → `/dashboard` (offline mod) | Ağ yok + cache yok → `/offline`

---

### SCR-002 — Welcome
**Route:** `/welcome`

3 slaytlı uygulama tanıtımı. İlk ziyarette gösterilir.

**Bileşenler:**
- Slayt 1: Paranı Tanı
- Slayt 2: Hedeflerine Ulaş
- Slayt 3: Alışkanlık Kazan
- Pagination dots
- Atla butonu (sağ üst)
- Başla butonu (son slayt)

**Aksiyonlar:** Swipe/ok ile geçiş | Atla veya Başla → `/register`

---

### SCR-003 — Kayıt
**Route:** `/register`

**Bileşenler:**
- Ad Soyad, Email, Şifre, Şifre tekrar inputları
- KVKK onay checkbox + link
- Kayıt Ol butonu
- Google ile Giriş
- Apple ile Giriş
- Giriş Yap linki

**API:** `POST /auth/register` | `POST /auth/oauth/google` | `POST /auth/oauth/apple`

**Hata:** Email kayıtlı → inline | KVKK onaylanmadı → buton disabled | Ağ yok → toast

---

### SCR-004 — Giriş
**Route:** `/login`

**Bileşenler:**
- Email, Şifre inputları
- Şifremi Unuttum linki
- Giriş Yap butonu
- Google / Apple giriş
- Kayıt Ol linki

**API:** `POST /auth/login` | `POST /auth/oauth/google` | `POST /auth/oauth/apple`

**Hata:** Hatalı şifre → inline (5 deneme → 15dk kilit)

---

### SCR-005 — Şifre Sıfırlama
**Route:** `/forgot-password`

2 adımlı akış.

**Bileşenler:**
- Adım 1: Email input + Link Gönder butonu
- Adım 2: Onay ekranı + Tekrar Gönder (60s timer)

**API:** `POST /auth/password/forgot`

---

### SCR-006 — Onboarding Sihirbazı
**Route:** `/onboarding`

5 adımlı ilk kurulum. Bir kez gösterilir.

**Bileşenler:**
- Progress bar (5 adım)
- Adım 1 — Gelir: Çoklu seçim + tutar girişi
- Adım 2 — Kategoriler: Grid seçim (10 varsayılan)
- Adım 3 — Hedef tipi: 3 kart (Biriktirmek / Anlamak / Tasarruf)
- Adım 4 — Bildirim: İzin + tercih saati + Şimdi Değil
- Adım 5 — Hazır: Konfeti animasyonu + CTA

**API:** `POST /onboarding/complete`

**Hata:** Tutar girilmeden ilerleme → inline validasyon

---

### SCR-007 — Dashboard
**Route:** `/dashboard`

**Bileşenler:**
- Header: Logo, "Merhaba [Ad]", bildirim zili (unread badge)
- Özet kart: net bakiye, toplam gelir/gider, kalan bütçe, kalan gün, günlük ortalama
- Durum şeridi: Yeşil (<70%) / Sarı (70-90%) / Kırmızı (>90%)
- Ay değiştirme (← Nisan 2026 →)
- Haftalık bar grafik (Recharts) — günlük ortalama referans çizgisi
- Kategori donut grafik (Recharts) — top 3 liste + geçen ay değişimi
- AI İçgörü kartı — başlık + 2 satır metin + beğen/beğenme
- Son işlemler — 5 satır + Tümünü Gör
- FAB (+) — sağ alt, sabit

**API:** `GET /dashboard/summary` | `GET /dashboard/chart/weekly` | `GET /dashboard/chart/category` | `GET /dashboard/recent` | `GET /insights/latest`

**Hata:** API hata → cache göster + sarı banner | AI yok (<30 işlem) → placeholder kart

**Boş State:** "Henüz gider yok" kartı + FAB pulse animasyonu

---

### SCR-008 — İşlem Listesi
**Route:** `/transactions`

**Bileşenler:**
- Arama input
- Tür toggle (Tümü / Gider / Gelir)
- Filtre butonu (aktif filtre badge)
- Aktif filtre chips (× kapatılabilir)
- Sıralama dropdown (Tarih / Kategori / Tutar)
- Liste: tarih grupları, günlük toplam header
- Her satır: kategori ikon, isim/not, tutar (kırmızı/yeşil), saat
- Swipe-to-delete
- Infinite scroll (30/sayfa)

**API:** `GET /transactions`

**Boş State:** İllüstrasyon + "İlk giderini ekle" CTA

---

### SCR-009 — Hızlı Gider Girişi
**Route:** `/transactions/new?mode=quick`

**Bileşenler:**
- Tam sayısal klavye
- Tutar display (büyük font)
- Kategori grid (4 kolon, kullanım sıklığına göre sıralı)
- Opsiyonel drawer (not, tarih) — swipe ile açılır
- Kaydet butonu
- Detaylı giriş linki

**API:** `POST /transactions`

**Hata:** Tutar 0 → inline | Kategori seçilmedi → shake animasyonu

---

### SCR-010 — Detaylı İşlem Girişi
**Route:** `/transactions/new`

**Bileşenler:**
- Tür toggle (Gider / Gelir)
- Tutar input
- Kategori seçici (modal)
- Alt kategori seçici
- Tarih & saat picker
- Not input (100 karakter, counter)
- Tekrarlayan toggle (ON → haftalık/aylık)
- Makbuz ekle (kamera / dosya)
- Kaydet butonu

**API:** `POST /transactions` | `GET /categories`

---

### SCR-011 — İşlem Detay & Düzenleme
**Route:** `/transactions/:id`

**Bileşenler:**
- Tutar (büyük)
- Kategori + alt kategori
- Tarih & saat
- Not
- Makbuz görseli (tap ile büyütür)
- Tekrarlayan bilgisi
- Son değişiklik tarihi
- Düzenle / Sil butonları

**API:** `PATCH /transactions/:id` | `DELETE /transactions/:id`

---

### SCR-012 — Gelir Yönetimi
**Route:** `/income`

**Bileşenler:**
- Bu ayın toplam geliri (özet kart)
- Gelir kaynakları listesi (aktif toggle)
- "Bu ay aldım" onay butonu (tekrarlayan için)
- Geçmiş kayıtlar (aylara göre gruplu)
- Kaynak ekle FAB

**API:** `GET /income/sources` | `GET /transactions?type=income` | `POST /transactions` | `POST /income/sources`

**Boş State:** "Gelir kaynağı ekleyerek başla"

---

### SCR-013 — Hedef Listesi
**Route:** `/goals`

**Bileşenler:**
- Aktif hedefler: isim, progress bar, kalan tutar, kalan gün, durum rengi
- Tamamlananlar arşivi
- Hedef ekle butonu

**API:** `GET /goals`

**Boş State:** "İlk finansal hedefini belirle" CTA

---

### SCR-014 — Hedef Detay
**Route:** `/goals/:id`

**Bileşenler:**
- Progress çember (% animasyonlu)
- Tutar: harcanan / hedef
- Kalan tutar + kalan gün
- Mini trend grafik
- Eşik bildirim durumları
- Düzenle / Sil butonları

**API:** `GET /goals/:id` | `PATCH /goals/:id` | `DELETE /goals/:id`

---

### SCR-015 — Hedef Oluşturma
**Route:** `/goals/new`

**Bileşenler:**
- Hedef türü: 4 kart (Harcama Limiti / Tasarruf / Kategori / Genel Bütçe)
- Hedef adı, Tutar inputları
- Kategori seçici (türe göre aktif)
- Dönem seçimi
- Özet önizleme
- Oluştur butonu

**API:** `POST /goals`

**Hata:** Tutar 0 → inline | Bitiş < başlangıç → inline

---

### SCR-016 — AI İçgörüler
**Route:** `/insights`

**Bileşenler:**
- İçgörü listesi: tip rozeti (Pattern/Anomali/Projeksiyon), başlık, 2 satır body, tarih, beğen/beğenme
- Tür filtresi

**API:** `GET /insights`

**Boş State:** "<30 işlem → X işlem daha gerekmektedir" progress bar

---

### SCR-017 — Bildirimler
**Route:** `/notifications`

**Bileşenler:**
- Okunmamış bölümü
- Geçmiş bölümü
- Her satır: ikon, başlık, açıklama, zaman
- Tümünü okundu yap butonu

**API:** `GET /notifications` | `PATCH /notifications/:id/read` | `PATCH /notifications/read-all`

**Boş State:** "Yeni bildiriminiz yok"

---

### SCR-018 — Profil & Ayarlar
**Route:** `/settings`

**Bileşenler:**
- Profil kartı: avatar, ad, üniversite, sınıf
- Düzenle butonu
- Tercihler: Para birimi, Dil
- Güvenlik: PIN kilidi toggle
- Bildirimler → `/settings/notifications`
- Tekrarlayan Giderler → `/recurring`
- Gizlilik politikası, Kullanım koşulları, Yardım
- Hesap Sil (kırmızı, Tehlike Bölgesi)

**API:** `DELETE /users/me`

---

### SCR-019 — Bildirim Tercihleri
**Route:** `/settings/notifications`

**Bileşenler:**
- Günlük hatırlatma toggle + saat seçici
- Haftalık özet toggle + gün seçici
- Hedef eşik uyarıları toggle
- Tekrarlayan hatırlatma toggle

**API:** `PATCH /notifications/preferences` (debounced 500ms)

---

### SCR-020 — Admin — Kullanıcı Listesi
**Route:** `/admin/users`

**Bileşenler:**
- Arama + filtre (aktif/pasif/silme bekleyen)
- Tablo: id, ad, email, kayıt tarihi, son giriş, işlem sayısı, durum
- Durum toggle (aktif/pasif)
- Hard delete butonu (çift onaylı)

**API:** `GET /admin/users` | `PATCH /admin/users/:id/status` | `DELETE /admin/users/:id`

---

### SCR-021 — Admin — Sistem Metrikleri
**Route:** `/admin/metrics`

**Bileşenler:**
- Özet kartlar: Toplam kullanıcı, Bugün yeni kayıt, Günlük işlem hacmi, Aktif kullanıcı (son 7 gün)
- Kullanıcı büyüme grafiği (son 30 gün)
- Popüler kategoriler listesi
- Dönem seçici (Bu hafta / Bu ay / Son 3 ay)

**API:** `GET /admin/metrics`

---

### SCR-022 — Admin — Kategori Yönetimi
**Route:** `/admin/categories`

**Bileşenler:**
- Sistem kategorileri tablosu: ikon, isim, renk, işlem sayısı
- Yeni kategori formu (Lucide ikon seçici, renk picker)
- Düzenle / Sil aksiyonları

**API:** `GET /admin/categories` | `POST /admin/categories` | `PATCH /admin/categories/:id` | `DELETE /admin/categories/:id`

**Hata:** Aktif işlemlerde kullanılan kategori silinemez

---

## 5. User Story'ler ve Kabul Kriterleri

### 5.1 Auth & Profil

#### US-001 — Email ile Kayıt (3 SP)
*Kullanıcı olarak email ve şifremle kayıt olabilmek istiyorum.*

- Email RFC 5322 formatında validate edilir
- Şifre min 8 karakter, 1 büyük harf, 1 rakam içermelidir
- KVKK checkbox seçilmeden kayıt butonuna basılamaz
- Başarılı kayıt sonrası JWT token localStorage'a kaydedilir
- Kullanıcı `/onboarding`'e yönlendirilir
- Email kayıtlıysa anlamlı inline hata gösterilir

#### US-002 — Google OAuth ile Giriş (3 SP)
*Kullanıcı olarak Google hesabımla hızlıca giriş yapabilmek istiyorum.*

- Google OAuth 2.0 flow tamamlanır
- Backend id_token doğrular
- Yeni kullanıcı → `/onboarding`, mevcut → `/dashboard`
- Google profil fotoğrafı avatar olarak kullanılır

#### US-003 — PIN Kilidi (2 SP)
*Kullanıcı olarak uygulamayı PIN ile kilitleyebilmek istiyorum.*

- Ayarlardan PIN kilidi aktif/pasif edilebilir
- 5 dakika arka planda kalınca kilit devreye girer
- Yanlış PIN 5 kez girilirse 15 dakika beklenir
- Cihaz biyometriği varsa desteklenir

### 5.2 Gider & Gelir

#### US-010 — Hızlı Gider Girişi (5 SP)
*Kullanıcı olarak 3 adımda hızlıca gider girebilmek istiyorum.*

- Klavye otomatik açılır
- Ondalıklı tutar girişi desteklenir (2 hane)
- Kategori seçilmeden kaydedilemez
- Kayıt 5 saniye içinde tamamlanabilir (end-to-end)
- Başarılı kayıt sonrası mini kutlama animasyonu (500ms)

#### US-011 — Tekrarlayan Gider (3 SP)
*Kullanıcı olarak Netflix gibi düzenli giderlerimi tanımlayabilmek istiyorum.*

- Gider girişinde tekrarlayan toggle aktif edilebilir
- Haftalık / aylık periyot seçimi yapılır
- Periyot başında tarayıcı bildirimi tetiklenir
- Silme geçmiş kayıtları etkilemez

#### US-012 — Gider Düzenleme (2 SP)
*Kullanıcı olarak yanlış girdiğim bir gideri düzenleyebilmek istiyorum.*

- Tüm alanlar düzenlenebilir
- Hata durumunda orijinal değerler korunur
- Son değişiklik tarihi gösterilir

#### US-013 — Makbuz Fotoğrafı (3 SP)
*Kullanıcı olarak giderime makbuz fotoğrafı ekleyebilmek istiyorum.*

- Kamera veya dosya seçici ile yükleme yapılabilir
- Maksimum 5MB, JPEG/PNG/HEIC desteklenir
- S3'e yüklenir, URL transaction'a kaydedilir
- Görsel tap ile büyük modalda görüntülenir
- Upload hatası transaction kaydını engellemez

### 5.3 Dashboard

#### US-020 — Aylık Bütçe Durumu (3 SP)
*Kullanıcı olarak bu ay ne kadar harcadığımı ve bütçem kaldığını görmek istiyorum.*

- Net bakiye büyük fontla gösterilir
- Renk kodu: Yeşil (<70%) / Sarı (70-90%) / Kırmızı (>90%)
- Ay değiştirme ile geçmiş aylara bakılabilir
- Dashboard <1.5 saniyede yüklenir

#### US-021 — Kategori Dağılımı (2 SP)
*Kullanıcı olarak harcamalarımın kategorilere göre dağılımını görmek istiyorum.*

- Donut grafik Recharts ile render edilir
- Top 3 kategori altında listelenir
- Geçen aya göre değişim yüzdesi gösterilir
- Grafik tıklanınca o kategorinin filtrelenmiş listesi açılır

### 5.4 Hedef Yönetimi

#### US-030 — Harcama Limiti Hedefi (3 SP)
*Kullanıcı olarak "bu ay yemeğe max 3000 TL" şeklinde limit belirleyebilmek istiyorum.*

- 4 hedef türü seçilebilir
- Kategori limiti seçilince kategori dropdown aktif olur
- Hedef oluşturulunca dashboard'da progress bar görünür
- Aynı kategoride çakışan aktif hedef varsa uyarı gösterilir

#### US-031 — Hedef Bildirimi (2 SP)
*Kullanıcı olarak hedefe yaklaştığımda bildirim almak istiyorum.*

- %80 dolumda uyarı bildirimi gönderilir
- %100 aşımında aksiyon bildirimi gönderilir
- Ayın son 3 günü risk bildirimi gönderilir
- Bildirimler ayarlardan kapatılabilir

### 5.5 AI İçgörü

#### US-040 — Harcama Pattern Analizi (5 SP)
*Kullanıcı olarak "Cuma akşamları daha fazla harcıyorsun" gibi içgörüler görmek istiyorum.*

- Min 30 işlem biriktikten sonra aktif olur
- İçgörü maks 2 cümle uzunluğundadır
- Kullanıcı adı içgörü metninde kullanılır
- Dashboard'da kart olarak gösterilir
- Beğen/beğenme veri loglanır
- 30 işlem öncesi "X işlem daha" placeholder gösterilir

#### US-041 — Ay Sonu Projeksiyonu (3 SP)
*Kullanıcı olarak mevcut harcama hızıma göre ay sonunu tahmin etmek istiyorum.*

- Geçen günlerin ortalamasına göre hesaplanır
- Projeksiyon > gelir ise kırmızı vurgulanır
- Hesaplama kural tabanlı (LLM yalnızca metni yazar)

#### US-042 — Anomali Tespiti (4 SP)
*Kullanıcı olarak beklenmedik yüksek harcama yaptığımda uyarı almak istiyorum.*

- 30 günlük kategori ortalamasını 2x aşan işlem anomali sayılır
- Anomali tespitinde tarayıcı bildirimi gönderilir
- "Bu normal, bir daha gösterme" seçeneği sunulur

### 5.6 Offline

#### US-050 — Offline Gider Girişi (4 SP)
*Kullanıcı olarak internet yokken de gider girebilmek istiyorum.*

- Offline durumda form çalışır
- Gider localStorage queue'ya kaydedilir
- Banner: "Çevrimdışı — bağlantı gelince senkronize edilecek"
- Bağlantı gelince queue otomatik flush edilir
- Son 30 günlük veri offline görüntülenebilir

### 5.7 Admin

#### US-060 — Kullanıcı Yönetimi (3 SP)
*Admin olarak tüm kullanıcıları listeleyip yönetebilmek istiyorum.*

- Email ve ada göre arama yapılabilir
- Kullanıcı aktif/pasif edilebilir
- Silme bekleyen hesaplar filtrelenebilir
- Hard delete yalnızca admin yetkisiyle yapılabilir

#### US-061 — Sistem Metrikleri (2 SP)
*Admin olarak platform kullanımını izleyebilmek istiyorum.*

- Günlük aktif kullanıcı sayısı görüntülenir
- Yeni kayıt ve işlem hacmi takip edilir
- Popüler kategoriler listelenir
- Dönem filtresi çalışır (hafta/ay/3 ay)

#### US-062 — Kategori Yönetimi (2 SP)
*Admin olarak sistem kategorilerini yönetebilmek istiyorum.*

- Yeni sistem kategorisi eklenebilir
- Kategori adı, ikonu (Lucide) ve rengi düzenlenebilir
- Aktif işlemlerde kullanılan kategori silinemez

### 5.8 Sprint & Puan Özeti

| Modül | Story'ler | SP |
|---|---|---|
| Auth & Profil | US-001 — US-003 | 8 |
| Gider & Gelir | US-010 — US-013 | 13 |
| Dashboard | US-020 — US-021 | 5 |
| Hedef | US-030 — US-031 | 5 |
| AI İçgörü | US-040 — US-042 | 12 |
| Offline | US-050 | 4 |
| Admin | US-060 — US-062 | 7 |
| Teknik altyapı & CI/CD | — | ~20 |
| **TOPLAM** | | **~74 SP** |

---

## 6. Definition of Done

Bir story'nin "bitti" sayılması için tüm maddeler karşılanmış olmalıdır.

| Kategori | Kriter |
|---|---|
| Kod | PR açıldı, en az 1 code review onayı alındı |
| Kod | ESLint ve TypeScript type check hatasız geçti |
| Test | Unit test coverage bu modülde min %70 |
| Test | API endpoint Postman collection'da güncellendi ve test geçiyor |
| Test | QA manuel test senaryosu çalıştırıldı |
| Performans | Dashboard <1.5sn, diğer sayfalar <2sn |
| Hata | Boş state, offline, API hata durumları test edildi |
| UI | Tasarım dosyasıyla karşılaştırıldı |
| Güvenlik | Token veya şifre console/log'a yazılmıyor |
| PO Onayı | Acceptance criteria PO tarafından check edildi |

---

## 7. Hata ve Edge Case Kataloğu

| ID | Senaryo | Tetikleyici | Davranış |
|---|---|---|---|
| EC-001 | İnternet yok — okuma | Sayfa açılışı | Cache varsa göster + sarı banner. Cache yok → offline sayfası. |
| EC-002 | İnternet yok — yazma | Gider girişi | localStorage queue'ya kaydet. Banner: "Çevrimdışı kaydedildi". Bağlantı gelince sync. |
| EC-003 | JWT süresi doldu | API isteği | Refresh token ile silent renewal. Refresh da dolmuşsa → /login + toast. |
| EC-004 | AI servisi unavailable | İçgörü yükleme | Kural tabanlı fallback. Yoksa placeholder. 24 saat sessiz. |
| EC-005 | Çift gider girişi | Kaydet'e hızlı çift tık | Buton disabled gönderince. Backend idempotency key ile mükerrer engeller. |
| EC-006 | Kategori sil — işlem var | Kategori silme | "X işlem var, Diğer'e taşınacak" onay dialog. Kabul → migrate → sil. |
| EC-007 | Hesap silme geri dönüş | 30 gün içinde iptal | delete_requested_at sıfırlanır. Email gönderilir. 30 gün → CRON siler. |
| EC-008 | Para birimi değişikliği | Kullanıcı birimini değiştirirse | Eski kayıtlar orijinal birimiyle tutulur. Raporda uyarı gösterilir. |
| EC-009 | AI < 30 işlem | Yeni kullanıcı | "X işlem daha" progress göstergesi. İçgörü placeholder. |
| EC-010 | Admin hard delete | Admin kullanıcıyı siler | Çift onay dialog. Geri alınamaz. Log kaydı tutulur. |

---

## 8. AI İçgörü Motoru

### 8.1 Mimari

Hibrit yaklaşım: Kural motoru ham veriyi hesaplar → Claude API yalnızca doğal dil metni üretir.

| Adım | Açıklama | Teknoloji |
|---|---|---|
| 1. Tetikleyici | Yeni transaction (anomali) veya günlük CRON (pattern/projeksiyon) | FastAPI background task / APScheduler |
| 2. Kural Motoru | Ham veri hesaplanır: ortalamalar, eşikler, trend | Python (pure logic) |
| 3. rule_data | Hesaplanan veri JSONB olarak kaydedilir | PostgreSQL JSONB |
| 4. LLM Çağrısı | Claude API'ye prompt + rule_data gönderilir | Anthropic Python SDK |
| 5. Kayıt | Metin ai_insights.body'ye yazılır, bildirim gönderilir | PostgreSQL + Web Push |

### 8.2 Tetikleyici Koşullar

| Tip | Tetikleyici | Min Veri | Eşik |
|---|---|---|---|
| anomaly | Her POST /transactions | 1 ay geçmiş | Kategori 30 günlük ortalamanın 2x'ini aşarsa |
| pattern | Günlük CRON (09:00) | 30 işlem | Hafta içi/sonu, saat, kategori pattern |
| projection | Günlük CRON (09:00) | 7 günlük veri | Günlük ort. × kalan gün |
| weekly_summary | Haftalık CRON (Pazar 20:00) | 1 hafta veri | Haftalık toplam, top kategori, fark |

### 8.3 Prompt Yapısı

```
System:
"Sen bir kişisel finans koçusun. Sana kullanıcının harcama verilerini
vereceksin, sen 1-2 cümleyle Türkçe, samimi ve kişisel bir içgörü
yazacaksın. Kullanıcı adını kullan. Asla finansal tavsiye verme."

User:
"Kullanıcı: [Ad]. Veri: [rule_data JSON]. Buna göre bir içgörü yaz."

Parametreler:
- model: claude-sonnet-4
- max_tokens: 150
- temperature: 0.7
```

---

## 9. Performans ve Güvenlik

### 9.1 Performans Hedefleri

| Metrik | Hedef | Ölçüm |
|---|---|---|
| Dashboard yükleme | < 1.5 saniye | Chrome DevTools / Lighthouse |
| Gider girişi (end-to-end) | < 5 saniye | Manuel QA |
| API p95 latency | < 500ms | FastAPI middleware |
| AI içgörü üretimi | < 3 saniye | APM trace |
| Sayfa geçişleri | < 300ms | React Profiler |

### 9.2 Güvenlik

| Kontrol | Uygulama |
|---|---|
| TLS 1.3 | Tüm trafik HTTPS zorunlu, HSTS header |
| JWT | Access 15dk, Refresh 30gün, rotation aktif |
| Rate Limiting | Auth: 5 req/5dk IP. Genel: 100 req/dk kullanıcı |
| Input Validation | Pydantic ile tüm endpoint'lerde şema kontrolü |
| SQL Injection | SQLAlchemy ORM — raw query yasak |
| CORS | Yalnızca whitelist origin'lere izin |
| Şifre Hash | bcrypt (cost factor 12) |
| Admin RBAC | FastAPI Dependency Injection ile role:'admin' kontrolü |
| KVKK | Silme talebinde 30 gün, sonra hard delete |
| S3 | Pre-signed URL (15dk), public erişim kapalı |

---

## 10. Sprint Planı

2 haftalık sprint'ler. Takım: 1 React developer, 1 FastAPI developer, 0.5 QA. Velocity: 15-20 SP/sprint.

| Sprint | Odak | Kapsam | SP |
|---|---|---|---|
| Sprint 1 | Altyapı & Auth | PostgreSQL şema, FastAPI setup, Auth (email + OAuth), JWT, CORS, Onboarding | 18 |
| Sprint 2 | Temel İşlemler | Kategori sistemi, Hızlı & detaylı gider girişi, Gelir kaynakları, Tekrarlayan giderler | 20 |
| Sprint 3 | Dashboard & Liste | Dashboard özet, Recharts grafikler, İşlem listesi + filtreleme + arama | 18 |
| Sprint 4 | Hedef & Bildirim | Hedef CRUD, Progress hesaplama, Web Push bildirimleri, Bildirim tercihleri | 16 |
| Sprint 5 | AI İçgörü | Kural motoru, Claude API entegrasyonu, APScheduler CRON, Feedback döngüsü | 20 |
| Sprint 6 | Offline & S3 | localStorage offline queue, Sync mekanizması, S3 makbuz yükleme, PIN kilidi | 18 |
| Sprint 7 | Admin Paneli | User management, Sistem metrikleri, Kategori yönetimi, RBAC | 16 |
| Sprint 8 | QA & Polish | Full regression, Performans optimizasyonu, KVKK akışı, Production deploy | Stabilization |

---

## 11. Sözlük

| Terim | Açıklama |
|---|---|
| ADR | Architecture Decision Record — Mimari karar kaydı |
| CRON | Zamanlanmış arka plan görevi (APScheduler) |
| DoD | Definition of Done — "Bitti" tanımı |
| FAB | Floating Action Button — Sağ altta sabit "+" butonu |
| Idempotency | Aynı isteğin birden fazla gönderilmesinin aynı sonucu üretmesi |
| JWT | JSON Web Token — Kimlik doğrulama tokeni |
| KVKK | Kişisel Verilerin Korunması Kanunu (6698 sayılı) |
| LLM | Large Language Model — Claude API |
| RBAC | Role Based Access Control — Rol tabanlı yetkilendirme |
| Soft Delete | is_deleted flag'i true yapılır, kayıt silinmez |
| SP | Story Point — Geliştirme karmaşıklığı ölçü birimi |
| p95 Latency | İsteklerin %95'inin yanıt süresi eşiği |

---

*FiCo AI MVP PRD — Gizli, Dahili Kullanım*