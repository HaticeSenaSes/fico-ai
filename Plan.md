# Plan

## Kullanıcı Hikayeleri ve Teknik Adımlar

### 1. Kullanıcı kayıt/giriş yapabilir
- [x] FastAPI `/auth/register`, `/auth/login`, `/auth/me` endpointleri (JWT)
- [x] React Native kayıt/giriş ekranları, AsyncStorage token yönetimi

### 2. Kullanıcı gelir/gider kaydedebilir
- [x] `/transactions` CRUD endpointleri (PostgreSQL)
- [x] Hızlı gider ekleme modalı (kategori seçimi, tutar, not)
- [x] Gelir ekranı (ekleme, listeleme)
- [x] İşlemler listesi (filtre: gider/gelir, arama, tarih gruplama)

### 3. Kullanıcı kategori yönetebilir
- [x] Sistem kategorileri seed (Yiyecek, Ulaşım, Market, vb.)
- [x] Kullanıcı özel kategori ekleyebilir (`POST /categories`)

### 4. Kullanıcı bütçe hedefi belirleyebilir
- [x] `/goals` CRUD endpointleri
- [x] Hedefler ekranı (aktif/tamamlanan hedefler, ilerleme çubuğu)

### 5. Dashboard ile genel durumu görebilir
- [x] `/dashboard/summary`, `/chart/weekly`, `/chart/category`, `/recent` endpointleri
- [x] Net bakiye, bütçe durumu, haftalık harcama grafiği, kategori dağılımı

### 6. Yapay zeka destekli içgörü alabilir
- [x] `insight_engine.py`: son 30 gün işlem analizi + Claude API entegrasyonu
- [x] Dashboard'da AI içgörü kartı

### 7. Bildirim alabilir
- [x] `/notifications` endpoint: bütçe uyarısı, hedef uyarısı, AI içgörü bildirimi, günlük hatırlatma
- [x] Bildirimler ekranı, okunmamış sayaç

### 8. Uygulama her yerden erişilebilir olmalı
- [x] Backend Railway'e deploy edildi (PostgreSQL dahil)
- [x] Mobile uygulama production API'ye bağlandı

## Gelecek Adımlar (v2)
- Web frontend'in backend'e entegrasyonu ve deploy edilmesi
- Profil sayfasında gerçek istatistikler (toplam işlem, hedef sayısı, içgörü sayısı)
- İşlem detayında kategori bilgisinin gösterilmesi
- Push notification entegrasyonu
