# FiCo AI — Financial Coach
## Product Requirements Document
### Teknik Product Owner Referans Dokümanı

| Alan | Değer |
|---|---|
| Versiyon | v1.0 |
| Tarih | Nisan 2026 |
| Durum | Taslak — Teknik PO İnceleme |
| Gizlilik | Gizli — Dahili Kullanım |

---

## 1. Yürütme Özeti

### 1.1 Ürün Vizyonu

FiCo AI, üniversite öğrencilerinin finansal okuryazarlık eksikliğini gidermek ve erken yaşta sağlıklı finansal alışkanlıklar kazandırmak amacıyla tasarlanmış, yapay zeka destekli bir kişisel finans yönetimi platformudur.

Geleneksel gider takip uygulamalarından farklı olarak FiCo AI; davranışsal ekonomi modelleri ve yapay zeka analizlerini kullanarak kullanıcılara harcama alışkanlıkları üzerine derinlemesine içgörüler sunar. Uygulama, finans yönetimini pasif bir takip sürecinden aktif bir öğrenme deneyimine dönüştürür.

### 1.2 Hedef Kitle

| Segment | Tanım |
|---|---|
| Birincil | 18-25 yaş, Türkiye'deki üniversite öğrencileri |
| Gelir profili | Burs, aile harçlığı, part-time iş — sınırlı ama düzenli gelir |
| Davranış | Mobil-first, kısa dikkat süresi, sosyal medya alışkanlıkları güçlü |
| Problem | Paranın nereye gittiğini bilmiyor, bütçe yapmıyor, finansı anlayamıyor |

### 1.3 Temel Farklılaştırıcı

- Sıradan gider takibi değil — AI destekli davranışsal içgörü motoru
- Öğrenci segmentine özel tasarım (kategori, dil, UX)
- Yargılamayan, merak uyandıran AI tonu
- Uzun vadeli network effect: kullanıcı arttıkça ürün değeri artar

### 1.4 Başarı Kriterleri

| Metrik | Faz 1 Hedef | Faz 2 Hedef | Faz 3 Hedef |
|---|---|---|---|
| 30 günlük retention | %35+ | %45+ | %55+ |
| DAU/MAU oranı | %20+ | %35+ | %50+ |
| Ortalama session süresi | 3+ dk | 5+ dk | 7+ dk |
| AI içgörü beğeni oranı | %60+ | %70+ | %75+ |
| Referans ile gelen kayıt | — | — | %30+ |

---

## 2. Ürün Mimarisi & Teknik Genel Bakış

### 2.1 Platform Hedefi

- iOS ve Android — native mobil uygulama (React Native önerilir)
- Web versiyonu Faz 3 sonrası değerlendirmeye alınabilir
- Backend: REST API mimarisi
- AI motoru: LLM API entegrasyonu (GPT-4 / Claude) + kural bazlı hibrit

### 2.2 Temel Modüller

| Modül | Açıklama | Faz |
|---|---|---|
| Auth & Profil | Kayıt, giriş, oturum yönetimi, kullanıcı profili | Faz 1 |
| Onboarding | 5 adımlı kurulum sihirbazı | Faz 1 |
| Gelir Yönetimi | Gelir kaynakları, girişi, geçmiş | Faz 1 |
| Gider Yönetimi | Hızlı/detaylı giriş, listeleme, düzenleme | Faz 1 |
| Kategori Motoru | Varsayılan + özel kategoriler, akıllı öneri | Faz 1 |
| Dashboard | Özet, grafikler, AI içgörü kartı | Faz 1 |
| Hedef Yönetimi | Hedef oluşturma, takip, bildirim | Faz 1 |
| AI İçgörü Motoru | Pattern analizi, projeksiyon, anomali tespiti | Faz 1 |
| Bildirim Sistemi | Push + in-app bildirimler | Faz 1 |
| Finansal Sağlık Skoru | 0-100 arası haftalık güncel skor | Faz 2 |
| Streak Sistemi | Günlük alışkanlık döngüsü | Faz 2 |
| Abonelik Takibi | Otomatik tespit, yenileme uyarısı | Faz 2 |
| Senaryo Simülatörü | Anlık harcama etkisi hesaplama | Faz 2 |
| Micro-Learning Feed | Kişiselleştirilmiş günlük finans kartları | Faz 2 |
| Hedef Yol Haritası | Milestone bazlı uzun vadeli hedef takibi | Faz 2 |
| Benchmark Network | Anonim kullanıcı karşılaştırmaları | Faz 3 |
| Arkadaş Grupları | Ortak harcama ve bölüşüm sistemi | Faz 3 |
| AI Koç (Sohbet) | Kişisel veriye dayalı conversational AI | Faz 3 |
| Referans Programı | Davet & ödül mekanizması | Faz 3 |

---

## 3. Faz 1 — Çekirdek Değer (MVP)

> **Hedef:** Kullanıcı uygulamayı indirip ilk 30 günde terk etmesin.
> **Tahmini Geliştirme Süresi:** 3-4 ay

### 3.1 Kimlik & Oturum Yönetimi

#### 3.1.1 Kayıt & Giriş
- Email + şifre ile kayıt
- Google OAuth ile kayıt/giriş
- Apple Sign In (iOS için zorunlu)
- Şifre sıfırlama (email doğrulama linki)
- Oturum hatırlama (30 günlük JWT token)
- Cihaz bazlı güvenli oturum yönetimi

#### 3.1.2 Kullanıcı Profili
- Ad, soyad, profil fotoğrafı
- Üniversite seçimi (Türkiye üniversiteleri dropdown listesi)
- Şehir bilgisi
- Öğrencilik yılı (1. sınıf … Yüksek Lisans)
- Para birimi tercihi (varsayılan: TRY)
- Profil düzenleme ekranı
- Hesap silme akışı (KVKK uyumu — 30 gün geri dönüş süresi)

### 3.2 Onboarding Akışı

#### 3.2.1 İlk Kurulum Sihirbazı (5 Adım)
- Adım 1: Uygulama tanıtımı — 3 cümle, görsel destekli (skip edilebilir)
- Adım 2: Aylık gelir girişi — Burs / Harçlık / Part-time çoklu seçim + tutar
- Adım 3: Harcama kategori tercihi — çoklu seçim ile ön filtreleme
- Adım 4: Finansal hedef tipi — Biriktirmek / Anlamak / Tasarruf etmek
- Adım 5: Bildirim izni + tercih günü ve saati

#### 3.2.2 İlk Deneyim Yönlendirmesi
- Onboarding sonrası "ilk giderini gir" CTA ekranı
- Boş state ekranları: bilgilendirici ve motive edici metin + görsel
- İlk 3 giriş sonrası micro-kutlama animasyonu
- İlk 7 günde günlük hafif hatırlatma push notification

### 3.3 Gelir Yönetimi

#### 3.3.1 Gelir Kaynakları
- Birden fazla gelir kaynağı tanımlanabilir
- Gelir türleri: Burs, Aile Harçlığı, Part-time İş, Serbest Çalışma, Diğer
- Her kaynak için: isim, tutar, tekrar sıklığı (aylık / tek seferlik / düzensiz)
- Gelir kaynağı aktif/pasif durumu

#### 3.3.2 Gelir Girişi & Takibi
- Tutar, kaynak ve tarih manuel giriş
- Tekrarlayan gelirler için "Bu ay aldım mı?" hızlı onay akışı
- Geçmiş ay gelir düzenleme imkanı
- Gelir girişi sonrası anlık net bakiye güncellemesi
- Kaynak bazında gelir dağılımı ve aylık geçmiş

### 3.4 Gider Yönetimi

#### 3.4.1 Hızlı Gider Girişi
- Ana ekrandan tek tap ile gider girişi ekranı açılır
- Tam ekran sayısal klavye — hızlı tutar girişi
- Rakam sonrası kategori seçimi (swipe veya grid)
- Opsiyonel: not (max 100 karakter), tarih değiştirme
- 3 tap'te işlem tamamlanır — sürtünme minimum

#### 3.4.2 Detaylı Gider Girişi
- Tutar, kategori + alt kategori, tarih & saat
- Not alanı
- Tekrarlayan gider tanımı (haftalık / aylık)
- Harcama etiketi (opsiyonel)
- Fiş/makbuz fotoğrafı ekleme (opsiyonel)

#### 3.4.3 Gider Düzenleme & Silme
- İşlem üzerine tap → düzenleme ekranı
- Swipe-to-delete + onay diyaloğu
- Toplu seçim ve toplu silme
- Son 1 değişikliğin görüntülenmesi

#### 3.4.4 Tekrarlayan Giderler
- Tekrarlayan gider tanımı: isim, tutar, kategori, periyot
- Periyot başında otomatik giriş önerisi bildirimi
- Tekrarlayan gider yönetim ekranı (listele, düzenle, sil)
- Dashboard'da tekrarlayan giderlerin ayrı gösterimi

#### 3.4.5 Gider Geçmişi & Listeleme
- Tüm giderler kronolojik listede
- Tarihe / kategoriye / tutara göre sıralama
- Kategori, tarih aralığı ve tutar aralığı filtreleri
- Not içinde metin bazlı arama
- Sonsuz scroll ile sayfalama

### 3.5 Kategori Yönetimi

#### 3.5.1 Varsayılan Kategoriler

| Ana Kategori | Alt Kategoriler |
|---|---|
| Yemek & İçecek | Restoran, Kafe, Market, Yemek Siparişi, Atıştırmalık |
| Ulaşım | Toplu Taşıma, Taksi/Uber, Akaryakıt, Araç Bakım |
| Eğitim | Kitap, Kurs, Kırtasiye, Okul Ücreti |
| Eğlence | Sinema/Konser, Oyun, Abonelikler, Spor |
| Sağlık | Eczane, Doktor, Spor Salonu |
| Giyim & Aksesuar | Kıyafet, Ayakkabı, Aksesuar |
| Fatura & Abonelik | Telefon, İnternet, Elektrik, Su, Streaming |
| Kişisel Bakım | Kuaför, Kozmetik, Hijyen |
| Sosyal | Hediye, Etkinlik, Bağış |
| Diğer | Tanımlanamayan harcamalar |

#### 3.5.2 Özel Kategori Yönetimi
- Yeni ana kategori: isim + ikon + renk seçimi
- Yeni alt kategori: mevcut ana kategoriye bağlı
- Kategori düzenleme ve silme (silmede "Diğer"e taşı uyarısı)
- Kategori gizleme ve sürükle-bırak sıralama

#### 3.5.3 Akıllı Kategori Önerisi
- Tekrar eden aynı tutarda giriş → otomatik kategori önerisi
- Not metnine bakarak kategori tahmini (örn: "starbucks" → Kafe)
- Öneriyi kabul et / reddet / düzenle akışı
- Kullanıcı tercihine göre model zamanla iyileşir

### 3.6 Dashboard & Ana Ekran

#### 3.6.1 Üst Özet Kartı
- Bu ayki net bakiye (gelir - gider)
- Kalan bütçe + kalan gün + günlük ortalama harcama
- Renk kodlu durum: Yeşil (iyi) / Sarı (dikkat) / Kırmızı (aşıldı)

#### 3.6.2 Harcama Dağılımı
- Halka / pasta grafik — kategori bazlı
- Grafik üzerine tap → kategori detay ekranı
- En yüksek 3 kategori highlight
- Geçen aya göre değişim oklarla gösterilir

#### 3.6.3 Günlük/Haftalık Bar Grafik
- Son 7 günün harcama çubuğu grafiği
- Günlük ortalama referans çizgisi
- Çubuğa tap → o günün gider listesi

#### 3.6.4 Son İşlemler & AI İçgörü Kartı
- Son 5 gider özet satırı: ikon, kategori, tutar, tarih
- AI içgörü kartı: güncel en kritik 1 içgörü
- "Tüm içgörüleri gör" ve "Tümünü gör" linkleri

### 3.7 Hedef Yönetimi

#### 3.7.1 Hedef Türleri
- Harcama limiti: "Bu ay yemeğe max 3.000 TL harcayacağım"
- Tasarruf hedefi: "Bu ay 1.000 TL biriktireceğim"
- Kategori bazlı kısıtlama: "Eğlenceye aylık 500 TL sınırı"
- Genel bütçe hedefi: "Toplam harcamam 5.000 TL'yi geçmesin"

#### 3.7.2 Hedef Oluşturma & Takibi
- Hedef türü, tutar, kategori (gerekiyorsa), periyot, isim girişi
- Progress bar ile yüzde dolum animasyonu
- Kalan tutar ve kalan gün gösterimi
- Hedef aşım kırmızı uyarı, tamamlama kutlama animasyonu

#### 3.7.3 Hedef Bildirimleri
- %50 dolumda: "Hedefe yarı yolda, harika gidiyorsun"
- %80 dolumda: "Dikkat, hedefe yaklaşıyorsun"
- %100 aşımda: "Hedefi aştın, ne yapmak istersin?"
- Ayın son 3 günü hedef risk analizi bildirimi

#### 3.7.4 Hedef Geçmişi
- Tamamlanan hedefler arşivi
- Başarı oranı istatistiği (tutturulan / toplam)
- Geçmiş ay hedef performansı karşılaştırması

### 3.8 AI İçgörü Motoru (Temel)

> **Kritik Not:** Bu özellik uygulamayı rakiplerinden ayıran tek unsurdur. MVP'de kural tabanlı + LLM hibrit mimarisi önerilir.

#### 3.8.1 Harcama Pattern Analizi
- Haftanın hangi günleri daha fazla harcama yapıldığı
- Günün hangi saatlerinde harcama yoğunlaştığı
- Hangi kategoride ani sapma olduğu
- Kişiselleştirilmiş "seni tanıyorum" hissi veren içgörü dili

#### 3.8.2 Anomali Tespiti
- Kategoride alışılmadık yüksek harcama uyarısı
- Kısa sürede çok sayıda işlem uyarısı
- Tekrarlayan giderde tutarsızlık tespiti

#### 3.8.3 Projeksiyon & Tahmin
- Ay sonu harcama tahmini
- Kategori bazlı projeksiyon
- Hedef aşım riski tahmini

#### 3.8.4 AI İçgörü UX İlkeleri

| İlke | Açıklama |
|---|---|
| Yargılamaz | Harcama miktarına değil örüntüye odaklanır |
| Merak uyandırır | Kuru veri değil bağlam ve soru ile sunar |
| Kısa & net | Maksimum 2 cümle per içgörü |
| Aksiyon önerir | Ne yapabileceğini söyler ama dayatmaz |
| Kişiselleştirilmiş | Kullanıcı adı + gerçek veriye dayalı |

### 3.9 Bildirim Sistemi (Temel)

| Bildirim Türü | Tetikleyici | Sıklık |
|---|---|---|
| Günlük giriş hatırlatması | Kullanıcı tanımlı saat | Günlük (opsiyonel) |
| Hedef eşik uyarısı | %50, %80, %100 aşımı | Anlık |
| Tekrarlayan gider hatırlatması | Tanımlı periyot tarihi | Periyodik |
| Haftalık AI özeti | Her Pazar (opsiyonel) | Haftalık |
| İlk 7 gün onboarding | Kayıt sonrası 7 gün | Günlük, azalan |

### 3.10 Veri, Güvenlik & Ayarlar

#### 3.10.1 Güvenlik
- PIN ve biyometrik kilit (Face ID / Parmak izi)
- Arka plana geçince otomatik kilit
- KVKK onay akışı kayıt sırasında
- Veri gizliliği şeffaflık ekranı
- Hesap silme: 30 gün geri dönüş süresi

#### 3.10.2 Ayarlar
- Profil bilgisi düzenleme
- Para birimi ve dil tercihi (TR / EN)
- Bildirim yönetimi
- Uygulama kilidi ayarı
- Veri export (CSV — tarih ve kategori seçimli)
- Gizlilik politikası ve kullanım koşulları
- Yardım / SSS, in-app geri bildirim
- Versiyon bilgisi

---

## 4. Faz 2 — Alışkanlık & Derinlik

> **Hedef:** Kullanıcıyı 30 günden 6 aya taşı. Günlük kullanım alışkanlığı kur.
> **Tahmini Geliştirme Süresi:** 3-4 ay
> **Ön Koşul:** Faz 1 kullanıcı verisinin min. 60 gün birikmesi

### 4.1 Finansal Sağlık Skoru
- 0-100 arası haftalık güncellenen tek skor
- Alt metrikler: bütçeye uyum, tasarruf oranı, hedef tutturma, harcama çeşitliliği, gelir istikrarı
- Skor düşüşünde sebep analizi + aksiyon önerisi
- Zaman içinde skor trend grafiği
- Skor paylaşılabilir görsel kart formatında

### 4.2 Streak & Alışkanlık Sistemi
- Günlük gider girişi streaki
- Haftalık hedef tutturma streaki
- Ayda 1 kez streak koruma jokeri
- Streak bazlı görsel rozetler
- Streak kırılma motivasyon bildirimi

### 4.3 Abonelik Takip & Optimizasyon
- Tekrarlayan giderlerden otomatik abonelik tespiti
- Abonelik listesi: isim, tutar, yenileme tarihi, yıllık toplam maliyet
- Yenileme 3 gün öncesi bildirim
- Kullanılmayan abonelik uyarısı
- Yıllık abonelik toplam maliyet özeti

### 4.4 Senaryo Simülatörü
- "X TL harcasam ne olur?" anlık hesaplama
- Bütçeye, hedeflere ve ay sonu projeksiyonuna etkisi
- Telafi planı önerisi
- Karar ver / Vazgeç / Sonra hatırlat

### 4.5 Micro-Learning Feed
- Kullanıcı verisine bağlı günlük finansal bilgi kartı (60 sn okuma)
- Swipe ile geç / kaydet / paylaş
- Kaydedilen kartlar kütüphanesi
- Kart serisi ile ilerleme mantığı

### 4.6 Finansal Hedef Yol Haritası (Milestone Sistemi)
- Büyük hedef → otomatik milestone bölümü
- Her milestone için kutlama animasyonu ve rozet
- Geride kalınca adaptif plan güncelleme
- Hedefe ulaşma tahmini sürekli güncellenir

### 4.7 AI İçgörü Motoru (Gelişmiş)
- Davranışsal örüntü tespiti (sınav haftası, hafta sonu analizi)
- Bağlam kurma: "Cuma akşamları aylık bütçenin %Y'sini harcıyorsun"
- Aylık kapanış raporu — paylaşılabilir görsel kart
- Geçen ayla kıyaslamalı trend analizi
- İçgörü kalite skoru: beğeni verisine dayalı model iyileştirmesi

### 4.8 Arama & Gelişmiş Filtreleme
- Global metin arama
- Çoklu kategori filtresi
- Tutar aralığı min-max slider
- Tekrarlayan / tek seferlik filtresi
- Aktif filtreler ekranda görünür, tek tap ile temizlenir

### 4.9 Raporlama (Gelişmiş)
- Kategori detay ekranı: 3 aylık trend grafiği
- Gelir vs gider karşılaştırma grafiği
- En tasarruflu ay vurgusu
- CSV export seçimli
- Aylık rapor paylaşılabilir görsel kart

---

## 5. Faz 3 — Topluluk & Büyüme

> **Hedef:** Kullanıcıyı ürünün parçasına dönüştür. Organik büyümeyi ateşle.
> **Tahmini Geliştirme Süresi:** 4-5 ay
> **Ön Koşul:** Faz 2'de yeterli kullanıcı tabanı ve veri birikimi

### 5.1 Anonim Benchmark Network
- Şehir + üniversite + sınıf segmentinde anonimleştirilmiş ortalamalar
- Kategori bazlı norm karşılaştırması
- Yargılamayan ton: "Bu senin için bilinçli bir tercih mi?"
- Minimum threshold sistemi — yetersiz veri olan segmentlerde gösterilmez

### 5.2 Arkadaş Grupları & Ortak Bütçe
- 2-8 kişilik grup oluşturma ve yönetimi
- Ortak harcama girişi ve bölüşüm hesabı
- Kim kime ne kadar borçlu özeti
- Grup içi anonimleştirilmiş karşılaştırma

### 5.3 Kişiselleştirilmiş AI Koç (Sohbet)
- Kullanıcının tüm finansal geçmişine erişimli conversational AI
- "Bu ay nerede hata yaptım?" → kişisel analiz
- "1.000 TL biriktirmek için plan yap" → veriye dayalı plan
- Sohbet geçmişi ve bağlam korunması

### 5.4 Referans & Ödül Programı
- Her kullanıcıya özel referans kodu
- Davet eden + katılan taraf ödülü
- Davet dashboard'u
- "3 arkadaş davet et, 1 ay premium kazan" mekanizması

### 5.5 Yıllık Özet & Uzun Vadeli Analiz
- 12 aylık toplam gelir/gider özeti
- En yüksek ve en düşük harcama ayı vurgusu
- Yıllık özet paylaşılabilir görsel kart
- Yıl başı finansal hedef belirleme ritüeli

---

## 6. Faz Karşılaştırma & Önceliklendirme

### 6.1 Faz Özet Tablosu

| | Faz 1 | Faz 2 | Faz 3 |
|---|---|---|---|
| Odak | Çekirdek değer | Alışkanlık & derinlik | Topluluk & büyüme |
| Süre | 3-4 ay | 3-4 ay | 4-5 ay |
| Hedef metrik | 30 günlük retention | DAU & session süresi | Viral katsayı & CAC |
| Kritik özellik | AI içgörü motoru | Streak + Sağlık Skoru | Benchmark + AI Koç |
| Başarı kriteri | Kullanıcı terk etmiyor | Kullanıcı her gün açıyor | Kullanıcı arkadaşını getiriyor |

### 6.2 Özellik Önceliklendirme Matrisi

| Özellik | Etki | Karmaşıklık | Faz |
|---|---|---|---|
| AI içgörü motoru | Çok Yüksek | Yüksek | Faz 1 |
| Hedef yönetimi | Yüksek | Orta | Faz 1 |
| Finansal Sağlık Skoru | Yüksek | Orta | Faz 2 |
| Streak sistemi | Yüksek | Düşük | Faz 2 |
| Abonelik takibi | Yüksek | Orta | Faz 2 |
| Senaryo simülatörü | Yüksek | Orta | Faz 2 |
| Micro-Learning Feed | Orta | Orta | Faz 2 |
| Referans programı | Yüksek | Düşük | Faz 3 |
| Benchmark Network | Çok Yüksek | Yüksek | Faz 3 |
| Arkadaş Grupları | Çok Yüksek | Yüksek | Faz 3 |
| AI Koç (Sohbet) | Çok Yüksek | Çok Yüksek | Faz 3 |

---

## 7. Teknik Gereksinimler & Kısıtlar

### 7.1 Platform & Stack Önerileri

| Katman | Öneri / Kısıt |
|---|---|
| Mobil | React Native (iOS + Android tek codebase) |
| Backend | REST API, Node.js veya Python FastAPI |
| Veritabanı | PostgreSQL (ilişkisel), Redis (cache) |
| AI Motoru | GPT-4 / Claude API + kural tabanlı hibrit (Faz 1) |
| Kimlik Doğrulama | JWT + OAuth2 (Google, Apple) |
| Push Bildirim | Firebase Cloud Messaging (FCM) |
| Depolama | AWS S3 veya equivalent |
| Analytics | Mixpanel veya Amplitude |

### 7.2 Güvenlik Gereksinimleri
- Tüm veriler TLS 1.3 ile şifreli iletim
- Hassas finansal veri AES-256 ile şifreli depolama
- KVKK uyumu — veri minimizasyon prensibi
- Kullanıcı verisi silme talebi 30 gün içinde yerine getirilir
- Ödeme bilgisi uygulamada saklanmaz (Faz 1'de ödeme yok)
- Rate limiting ve brute force koruması auth endpoint'lerinde

### 7.3 Performans Gereksinimleri

| Metrik | Hedef |
|---|---|
| Uygulama açılış süresi | < 2 saniye (cold start) |
| Dashboard yükleme | < 1 saniye |
| Hızlı gider girişi | < 3 tap, < 10 saniye |
| AI içgörü üretim süresi | < 3 saniye |
| API yanıt süresi (p95) | < 500ms |
| Uygulama boyutu | < 50MB |

### 7.4 AI Motoru Teknik Detayı
- Faz 1: Kural tabanlı pattern detection + LLM API hibrit
- LLM yalnızca doğal dil üretimi için kullanılır — analiz kural tabanlı
- Her kullanıcı için minimum 30 işlem biriktiğinde AI içgörü aktif olur
- İçgörü prompt şablonları versiyonlanır ve A/B test edilir
- Beğeni/beğenmeme verisi model iyileştirmesi için loglanır
- Faz 2+'da fine-tune veya RAG mimarisine geçiş değerlendirilir

---

## 8. Açık Kalan Kararlar & Teknik PO Gündemi

> Bu bölüm, teknik PO'nun öncelikle yanıt vermesi gereken kararları listeler.

| # | Karar | Seçenekler | Etki |
|---|---|---|---|
| 1 | Mobil framework | React Native vs Flutter vs Native | Yüksek |
| 2 | AI provider | OpenAI GPT-4 vs Anthropic Claude vs hybrid | Yüksek |
| 3 | Banka entegrasyonu | Faz 2'de mi, Faz 3'te mi? | Orta |
| 4 | Offline mod | Tam offline vs cache-only vs online-only | Orta |
| 5 | Monetizasyon | Freemium sınırı nerede? Hangi özellikler premium? | Çok Yüksek |
| 6 | Veri saklama süresi | Kullanıcı verisi ne kadar saklanır? | Orta |
| 7 | Benchmark eşiği | Kaç kullanıcı verisi gerektiğinde benchmark aktif? | Orta |
| 8 | İlk platform | iOS vs Android önce launch | Yüksek |

---

## 9. Sözlük

| Terim | Açıklama |
|---|---|
| DAU | Daily Active Users — Günlük aktif kullanıcı sayısı |
| MAU | Monthly Active Users — Aylık aktif kullanıcı sayısı |
| CAC | Customer Acquisition Cost — Kullanıcı başı edinim maliyeti |
| Retention | Kullanıcının belirli bir süre sonra hala aktif olması |
| Churn | Kullanıcının uygulamayı terk etmesi |
| Network Effect | Kullanıcı artışının ürün değerini artırması |
| LLM | Large Language Model — Büyük dil modeli (GPT, Claude vb.) |
| PRD | Product Requirements Document — Ürün gereksinimleri dokümanı |
| MVP | Minimum Viable Product — Minimum uygulanabilir ürün |
| JWT | JSON Web Token — Kimlik doğrulama tokeni |
| KVKK | Kişisel Verilerin Korunması Kanunu |
| A/B Test | İki farklı versiyonu karşılaştırmalı test etme |

---

*FiCo AI v1.0 PRD | Gizli — Dahili Kullanım*