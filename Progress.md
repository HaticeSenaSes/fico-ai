# Progress Log

## Şubat 2026
- Proje fikri belirlendi: öğrenciler için AI destekli finansal okuryazarlık uygulaması.
- PRD ve ürün yol haritası oluşturuldu.

## Mart-Nisan 2026
- FastAPI backend kuruldu: kullanıcı, işlem, kategori, hedef modelleri.
- JWT tabanlı authentication (register/login).
- PostgreSQL veritabanı şeması tasarlandı.
- React Native (Expo) mobil proje başlatıldı.

## Mayıs 2026
- Dashboard, işlemler, gelir, hedefler, profil ekranları geliştirildi.
- Mock data'dan gerçek backend bağlantısına geçiş yapıldı (tüm ekranlar).
- Claude API entegrasyonu: `insight_engine.py` ile kural motoru + LLM analizi.
- Bottom navigation tüm ekranlarda kalıcı hale getirildi.
- İşlem detay modalı, kategori ekleme özelliği eklendi.
- Bildirimler sistemi backend'e taşındı (bütçe/hedef/AI/günlük hatırlatma uyarıları).

## Haziran 2026
- Karşılaşılan sorunlar ve çözümleri:
  - **bcrypt uyumsuzluğu**: SHA-256 hash'e geçildi.
  - **ngrok URL değişkenliği**: geliştirme sürecinde tekrarlayan bağlantı sorunlarına yol açtı.
  - **Railway Postgres SSL template bağlantı sorunu**: standart Postgres template'ine geçilerek çözüldü.
  - **Dashboard "bu ay" filtresi**: yeni kullanıcılarda boş veri sorunu, ay bazlı filtreleme ile çözüldü.
  - **Token süresi (15 dk)**: geliştirme sırasında sık "Token doğrulanamadı" hatalarına yol açtı, login akışıyla yönetildi.
- Backend Railway'e deploy edildi (PostgreSQL dahil).
- Mobile uygulama production API'sine bağlandı.
- Eksik proje dokümanları (`tech-stack.md`, `Plan.md`, `DesignSystem.md`, `Progress.md`, root `README.md`) tamamlandı.

## AI Kullanımı (Geliştirme Süreci)
Proje boyunca Claude Code/Sonnet ile pair-programming şeklinde çalışıldı: backend endpoint tasarımı, React Native ekran bileşenleri, hata ayıklama (SQLAlchemy/FastAPI/Expo build hataları) ve Railway deploy sürecinde aktif olarak kullanıldı.
