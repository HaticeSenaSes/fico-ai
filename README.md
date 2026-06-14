# FiCo AI — Finansal Okuryazarlık Asistanı

FiCo AI, üniversite öğrencilerinin günlük gelir-gider takibi yapmasını, bütçe hedefleri belirlemesini ve yapay zeka destekli kişiselleştirilmiş finansal içgörüler almasını sağlayan bir mobil uygulamadır.

## Problem

Türkiye'deki üniversite öğrencilerinin büyük kısmı düzenli bir bütçe takip aracı kullanmıyor, harcama alışkanlıklarını fark etmiyor ve aylık harçlık/burs gelirini etkin yönetemiyor.

## Çözüm

FiCo AI; gelir-gider kaydı, kategori bazlı bütçe hedefleri ve Claude (Anthropic) destekli haftalık harcama analiziyle kullanıcıya "bu hafta en çok nereye harcadın, nasıl tasarruf edebilirsin" gibi kişiselleştirilmiş öneriler sunar.

## Mimari

- **/fico-mobile** — React Native (Expo) mobil uygulama (iOS)
- **/fico-backend** — FastAPI + PostgreSQL REST API
- **/fico-frontend** — React + Vite web arayüzü (geliştirme aşamasında)

## Canlı Backend

API: https://fico-backend-api-production.up.railway.app
Health check: https://fico-backend-api-production.up.railway.app/health
API docs: https://fico-backend-api-production.up.railway.app/docs

## Yapay Zeka Kullanımı

Backend, kullanıcının son 30 günlük işlemlerini analiz edip Anthropic Claude API'sine (claude-sonnet-4) gönderir. Claude, kural motorundan gelen istatistiksel verileri (en çok harcanan kategori, toplam tutar, yüzdelik dağılım) Türkçe, samimi bir dille kullanıcıya özetler ve tasarruf önerisi üretir. Bu içgörüler dashboard ve bildirimler ekranında gösterilir.

## Kurulum

### Backend
```bash
cd fico-backend
pip install -r requirements.txt
cp .env.example .env  # değerleri doldurun
uvicorn app.main:app --reload --port 8001
```

### Mobile
```bash
cd fico-mobile
npm install
npx expo run:ios
```

## Teknoloji Yığını

Detaylar için [tech-stack.md](./tech-stack.md) dosyasına bakın.

## Geliştirme Süreci

Detaylı geliştirme kararları ve ilerleme kaydı için [Progress.md](./Progress.md) dosyasına bakın.
