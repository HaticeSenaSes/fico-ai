---
name: fms-user-story-plani
overview: "`fms_prd.md` temel alınarak her user story için ayrı, uygulanabilir ve test odaklı geliştirme planı çıkarılır. Plan; backend, frontend, veri, edge-case ve doğrulama adımlarını story bazında netleştirir."
todos: []
isProject: false
---

# FiCo AI User Story Bazlı Geliştirme Planı

Kaynak PRD: [C:/Users/Sena/Desktop/FiCo AI/fms_prd.md](C:/Users/Sena/Desktop/FiCo AI/fms_prd.md)

Teknik referans noktaları:
- API kontratı: [C:/Users/Sena/Desktop/FiCo AI/fms_prd.md](C:/Users/Sena/Desktop/FiCo AI/fms_prd.md)
- Veri modeli: [C:/Users/Sena/Desktop/FiCo AI/fms_prd.md](C:/Users/Sena/Desktop/FiCo AI/fms_prd.md)
- DoD ve edge-case: [C:/Users/Sena/Desktop/FiCo AI/fms_prd.md](C:/Users/Sena/Desktop/FiCo AI/fms_prd.md)

## Planlama Yaklaşımı
- Her story bağımsız teslim edilebilir dilim olarak ele alınır.
- Her dilim için kapsam: Backend API/iş kuralı, Frontend ekran/etkileşim, doğrulama/test.
- Story kabul kriterleri doğrudan geliştirme checklist’ine çevrilir.

## Mimari Ayrım (Backend/Frontend Ayrı Deploy)
- Backend ve frontend fiziksel olarak ayrık kod tabanları şeklinde yönetilir: `fico-backend` (FastAPI) ve `fico-web` (React).
- Backend platform-agnostic API ürünü olarak tasarlanır; web frontend yalnızca bir istemci olur, iOS ikinci istemci olarak sonradan eklenebilir.
- Deploy pipeline’ları ayrılır: backend bağımsız container/app deploy, frontend bağımsız static/web deploy.
- Contract-first yaklaşım uygulanır: OpenAPI şeması backend’in tek doğruluk kaynağı olur; frontend bu kontrata göre entegre edilir.
- Auth, CORS, versiyonlama (`/api/v1`) ve rate limit kuralları istemciden bağımsız backend’de merkezileştirilir.
- Ortak teslim çıktısı: her story’de `backend task` ve `frontend task` ayrı PR/iş paketi olarak takip edilir.

## Story Bazlı Planlar

### US-001 — Email ile Kayıt
- Backend: `POST /auth/register` için email RFC formatı, şifre kuralı, KVKK zorunluluğu validasyonlarını Pydantic seviyesinde tanımla.
- Backend: Kayıt sonrası access/refresh JWT üret, kullanıcıyı varsayılan role ile oluştur, duplicate email için `409 CONFLICT` ve alan bazlı hata dön.
- Frontend: Kayıt formunda inline validasyon + KVKK işaretlenmeden submit kilidi.
- Frontend: Başarılı kayıtta token persist et ve `/onboarding` yönlendirmesi yap.
- Entegrasyon: frontend sadece public API kontratı üzerinden konuşur; backend tarafına UI bağımlı alan eklenmez.
- Test: API unit/integration testleri (valid/invalid/duplicate), form validation ve redirect senaryosu.

### US-002 — Google OAuth ile Giriş
- Backend: `POST /auth/oauth/google` akışında `id_token` doğrulaması ve kullanıcı eşleştirme/oluşturma.
- Backend: Yeni kullanıcıyı onboarding’e, mevcut kullanıcıyı dashboard’a yönlendirecek response flag’i üret.
- Frontend: Google giriş butonu, callback işleme, avatar alanına Google profil fotoğrafı bağlama.
- Entegrasyon: mobil istemciyi desteklemek için redirect kararı response flag/alanı ile verilir, route hardcode’u backend’e taşınmaz.
- Güvenlik: OAuth token doğrulama hatalarını anlamlı `401/400` ile ele al.
- Test: yeni vs mevcut kullanıcı ayrımı, hatalı token, avatar set edilmesi.

### US-003 — PIN Kilidi
- Backend/Model: kullanıcı tercihinde `app_lock_enabled` yönetimi (`users` alanı mevcut).
- Frontend: Ayarlarda PIN aç/kapat, PIN oluşturma/doğrulama ekranı ve 5 dk arkaplan timeout tetikleyicisi.
- Frontend: 5 yanlış denemede 15 dk lockout state; biyometrik capability varsa fallback/quick unlock akışı.
- Güvenlik: PIN’i hashli/korumalı depola, düz metin saklama yapma.
- Test: timeout, lockout, doğru/yanlış PIN, biyometrik mevcut/yok cihaz davranışı.

### US-010 — Hızlı Gider Girişi
- Frontend: `/transactions/new?mode=quick` ekranında numeric keypad auto-focus, 2 ondalık giriş, kategori zorunluluğu.
- Backend: `POST /transactions` için amount>0 ve kategori zorunlu kuralı.
- UX: başarılı kayıt sonrası 500ms kutlama animasyonu ve form reset.
- Performans: 3 adım akışın <5sn tamamlanması için minimum field + API latency takibi.
- Test: kategori yokken engelleme, 0 tutar hatası, başarı süresi ölçümü.

### US-011 — Tekrarlayan Gider
- Backend: `recurring_expenses` CRUD ve transaction ile bağlama (`recurring_id`).
- Frontend: gider girişinde recurring toggle + haftalık/aylık period seçimi.
- Scheduler: dönem başlangıcında bildirim üretimi (`notifications` tablosu üzerinden).
- İş kuralı: recurring kaydı silinse de geçmiş transaction kayıtlarına dokunma.
- Test: period tetikleme, geçmiş kayıt korunumu, bildirim üretimi.

### US-012 — Gider Düzenleme
- Backend: `PATCH /transactions/:id` ile alan bazlı güncelleme ve atomic transaction yönetimi.
- Frontend: düzenleme formunda tüm alanlar editlenebilir; hata olursa UI optimistic update rollback.
- UI: “son değişiklik tarihi” alanını detay ekranında göster.
- Test: kısmi güncelleme, validation error’da orijinal veri korunumu.

### US-013 — Makbuz Fotoğrafı
- Backend: S3 pre-signed upload veya doğrudan upload endpoint’i; max 5MB + format kontrol (JPEG/PNG/HEIC).
- Backend: upload başarısız olsa da transaction create akışını bloklama (best-effort attachment).
- Frontend: kamera/dosya picker, upload progress/hatayı bilgilendiren non-blocking UX.
- Frontend: transaction detayında makbuzu modal büyütme.
- Entegrasyon: iOS yeniden kullanım için upload akışı API-first tutulur (web’e özel dosya akışı varsayımı yapılmaz).
- Test: büyük dosya reddi, format validasyonu, upload fail’de transaction kaydı.

### US-020 — Aylık Bütçe Durumu
- Backend: `GET /dashboard/summary` hesaplamalarını net bakiye, kalan bütçe/gün, günlük ortalama ile tamamla.
- Frontend: durum rengi eşiklerini (yeşil/sarı/kırmızı) kart/şeritte uygula.
- Frontend: ay değiştirici ile geçmiş dönem sorguları.
- Performans: dashboard load hedefi <1.5s için query/index kontrolü (`idx_tx_user_date`).
- Test: eşik renkleri, ay geçişi, boş veri ve cache fallback.

### US-021 — Kategori Dağılımı
- Backend: `GET /dashboard/chart/category` ile kategori toplamları + geçen ay karşılaştırma yüzdesi.
- Frontend: Recharts donut + top3 liste + yüzde değişimi.
- Frontend: grafik segment click ile `/transactions` filtreli navigasyon.
- Test: sıfır veri, tek kategori, geçen ay verisi yok senaryosu.

### US-030 — Harcama Limiti Hedefi
- Backend: `POST /goals` için 4 hedef türü ve kategori limiti kuralı; çakışan aktif hedef kontrolü.
- Frontend: hedef oluşturma ekranında türe göre dinamik alan aktivasyonu.
- Frontend: hedef oluşunca dashboard progress bileşenine bağlama.
- Test: çakışma uyarısı, kategori zorunluluğu, limit hesaplaması.

### US-031 — Hedef Bildirimi
- Backend: hedef ilerleme eşik motoru (%80, %100, son 3 gün risk).
- Backend: bildirim tercihleriyle (`PATCH /notifications/preferences`) susturma/izin yönetimi.
- Frontend: hedef ve bildirim ekranlarında eşik tetik geçmişini görünür kıl.
- Test: eşik crossing senaryoları, tercih kapalıyken bildirim üretilmemesi.

### US-040 — Harcama Pattern Analizi
- Backend: min 30 transaction koşuluyla pattern trigger ve `rule_data` üretimi.
- AI: LLM yalnızca metin üretir; iş kuralı backend hesaplarında kalır.
- Frontend: dashboard insight kartı + beğen/beğenme feedback (`POST /insights/:id/feedback`).
- Frontend: <30 işlemde “X işlem daha” placeholder.
- Test: 30 altı/üstü aktivasyon, metin uzunluğu (max 2 cümle), feedback loglama.

### US-041 — Ay Sonu Projeksiyonu
- Backend: günlük ortalama * kalan gün formülü ile deterministic projeksiyon.
- Backend: projeksiyon gelirden yüksekse risk bayrağı ve kırmızı vurgu durumu döndür.
- Frontend: insight/projection kartında anlaşılır risk dili ve görsel vurgu.
- Test: düşük/orta/yüksek harcama hızlarında projeksiyon doğruluğu.

### US-042 — Anomali Tespiti
- Backend: kategori bazlı 30 günlük ortalamanın 2x eşiği ile anomaly kuralı.
- Backend: anomaly oluştuğunda bildirim üretimi ve “bir daha gösterme” tercihi saklama.
- Frontend: anomaly kartı/uyarısı + kullanıcı dismiss tercihi.
- Test: eşik altı/üstü, yeni kategori yetersiz veri durumu, mute davranışı.

### US-050 — Offline Gider Girişi
- Frontend: offline algılama, formun online bağımlılığı olmadan çalışması.
- Frontend: localStorage queue yapısı (idempotency key dahil) ve offline banner.
- Backend: sync sırasında duplicate engellemek için idempotency key doğrulaması.
- Sync: bağlantı gelince otomatik flush, conflict/idempotency yönetimi.
- Frontend: son 30 günlük cached listeleme.
- Test: offline create, reconnect sync, duplicate prevention.

### US-060 — Kullanıcı Yönetimi (Admin)
- Backend: `/admin/users` listeleme + arama + durum/silme-bekleyen filtreleri.
- Backend: `PATCH /admin/users/:id/status`, `DELETE /admin/users/:id` için admin RBAC zorunluluğu.
- Frontend: admin tablo, filtreler, aktif/pasif toggle, çift onaylı hard delete.
- Audit: hard delete aksiyonlarını logla.
- Test: admin dışı erişim engeli, filtre/doğrulama, delete geri alınamazlık.

### US-061 — Sistem Metrikleri (Admin)
- Backend: `GET /admin/metrics` için DAU, yeni kayıt, günlük işlem hacmi, popüler kategori aggregation.
- Backend: dönem filtresi (hafta/ay/3 ay) sorgu optimizasyonları.
- Frontend: metrik kartları + büyüme grafiği + filtre kontrolü.
- Test: dönem bazlı veri doğruluğu, boş veri fallback.

### US-062 — Kategori Yönetimi (Admin)
- Backend: sistem kategorisi CRUD (`/admin/categories`) ve aktif transaction bağlı kategoriyi silme engeli.
- Frontend: ikon (Lucide) + renk picker + düzenle/sil akışları.
- İş kuralı: silinemeyen kategoriler için açıklayıcı hata mesajı.
- Test: create/update/delete + bağlı işlem var/yok ayrımı.

## Önerilen Uygulama Sırası
1. Auth temel akışları: US-001, US-002
2. Çekirdek işlem yönetimi: US-010, US-012, US-011, US-013
3. Dashboard görünürlüğü: US-020, US-021
4. Hedef modülü: US-030, US-031
5. AI katmanı: US-040, US-041, US-042
6. Offline dayanıklılık: US-050
7. Admin paneli: US-060, US-061, US-062
8. Güvenlik/UX tamamlayıcı: US-003

## Her Story İçin Ortak Teslim Kriteri (DoD Uygulaması)
- Unit + integration test kapsamı story modülünde min %70.
- API kontrat/response formatının PRD ile birebir uyumu.
- Boş state, offline state, API hata state senaryoları.
- Performans hedefleri: Dashboard <1.5sn, diğer kritik akışlar <2sn.
- Güvenlik: token/şifre loglanmaması, RBAC ve validation kontrolleri.
- Ayrık deploy doğrulaması: backend deploy edilmeden frontend deploy edilebilmeli (ve tersi), kırılma olmamalı.

## Monorepo/Multirepo Uygulama Notu
- Tercih: iki ayrı repo (`fico-backend`, `fico-web`) ve ayrı CI/CD.
- Alternatif: tek monorepo içinde `apps/backend` + `apps/web`, fakat yine bağımsız build/deploy pipeline.
- iOS fazı için hazırlık: OpenAPI sözleşmesi versiyonlanır, breaking değişiklikler `v2` ile çıkarılır.