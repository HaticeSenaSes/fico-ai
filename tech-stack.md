# Tech Stack

## Backend — FastAPI + PostgreSQL

- **FastAPI**: Hızlı geliştirme, otomatik OpenAPI dokümantasyonu, async destek.
- **PostgreSQL**: İlişkisel veri (kullanıcılar, işlemler, hedefler, kategoriler) için güvenilir ve Railway'de kolay yönetilebilir.
- **SQLAlchemy**: ORM, model tanımları ve migration kolaylığı.
- **python-jose (JWT)**: Stateless authentication, access/refresh token yapısı.
- **Anthropic Claude API (claude-sonnet-4)**: Kullanıcı harcama verilerinden doğal dilde finansal içgörü üretimi.

## Mobile — React Native (Expo)

- **Expo / React Native**: iOS için hızlı native geliştirme, tek codebase.
- **AsyncStorage**: JWT token kalıcılığı, oturum yönetimi.
- **Context API**: Tema (açık/koyu mod) yönetimi.

## Web — React + Vite

- **Vite**: Hızlı geliştirme sunucusu ve build.
- **Recharts**: Grafik ve veri görselleştirme.

## Deploy

- **Railway**: Backend + PostgreSQL, otomatik CI/CD (railway up).

## AI Kullanım Stratejisi

Geliştirme sürecinde Claude (Anthropic) kullanıldı:
- Backend endpoint tasarımı ve hata ayıklama (SQLAlchemy, FastAPI hataları)
- React Native ekran bileşenlerinin yazımı ve mock-to-real-data dönüşümü
- Railway deploy sürecinde environment/network sorunlarının teşhisi

Uygulamanın kendisinde Claude API, kullanıcı harcama analizinde çekirdek özellik olarak kullanılıyor (bkz. `app/services/insight_engine.py`).
