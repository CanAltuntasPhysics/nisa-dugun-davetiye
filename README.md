# Nisa & Ömer — Düğün Davetiyesi

Romantik, sinematik, minimal bir düğün davetiye sitesi ve Google Drive destekli fotoğraf paylaşım sistemi.

## ✨ Özellikler

- **Sinematik Davetiye**: Golden hour temalı, editoryal düğün davetiyesi
- **Fotoğraf Albümü**: Misafirlerin fotoğraf yükleyip görüntüleyebildiği galeri
- **Google Drive Entegrasyonu**: Fotoğraflar Drive'da saklanır, site üzerinde görüntülenir
- **QR Kod Desteği**: Misafirler QR kod ile albüme erişebilir
- **Mobil Uyumlu**: Tüm cihazlarda kusursuz görüntüleme
- **Geri Sayım**: Düğün tarihine zarif geri sayım

## 🛠 Teknoloji

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (özel altın saat tasarım tokenleri ile)
- **Google Drive API** (fotoğraf depolama)
- **QR Code React** (QR kod oluşturma)

## 🚀 Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env.local.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.local.example .env.local
```

### 3. Google Drive API Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/) üzerinde yeni bir proje oluşturun
2. **Google Drive API**'yi etkinleştirin
3. **Service Account** oluşturun ve JSON anahtarını indirin
4. JSON anahtarından `client_email` ve `private_key` değerlerini `.env.local`'e kopyalayın
5. Google Drive'da iki klasör oluşturun:
   - **Upload Klasörü**: Yeni yüklemeler buraya gelir
   - **Gallery Klasörü**: Galeriye yalnızca bu klasördeki dosyalar gösterilir
   - *Basit kurulumda ikisi aynı klasör olabilir*
6. Klasörleri service account email adresiyle paylaşın (Editor yetkisi)
7. Klasör ID'lerini `.env.local`'e ekleyin

> **Klasör ID**: Drive'da klasörü açtığınızda URL'deki son kısım: `drive.google.com/drive/folders/{FOLDER_ID}`

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Site [http://localhost:3000](http://localhost:3000) adresinde açılır.

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── page.tsx                    # Ana davetiye sayfası
│   ├── layout.tsx                  # Root layout (fontlar, metadata)
│   ├── globals.css                 # Tasarım sistemi & stiller
│   ├── photos/
│   │   ├── page.tsx                # Fotoğraf albümü sayfası
│   │   └── PhotosClient.tsx        # Galeri/yükleme UI (client component)
│   └── api/photos/
│       ├── upload/route.ts         # POST — fotoğraf yükleme
│       └── list/route.ts           # GET — galeri listeleme
├── components/
│   ├── ui/
│   │   └── RevealSection.tsx       # Scroll reveal animasyon wrapper
│   └── sections/
│       ├── HeroSection.tsx         # Hero bölümü
│       ├── CoupleSection.tsx       # Çift fotoğrafı
│       ├── CountdownSection.tsx    # Geri sayım
│       ├── ProgramSection.tsx      # Düğün programı
│       ├── DriveSection.tsx        # QR & fotoğraf CTA
│       └── FooterSection.tsx       # Alt bilgi
└── lib/
    ├── drive.ts                    # Google Drive API servisi
    ├── useReveal.ts                # Intersection Observer hook
    └── useCountdown.ts             # Geri sayım hook
```

## 🎨 Tasarım Sistemi

| Token | Değer | Kullanım |
|-------|-------|----------|
| `--color-cream` | `#FAF6F1` | Ana arka plan |
| `--color-champagne` | `#D4B896` | Vurgu rengi |
| `--color-warm-charcoal` | `#3D3530` | Ana metin |
| `--color-taupe` | `#A89888` | İkincil metin |
| `--color-ivory` | `#F5F0E8` | Alternatif arka plan |
| `--font-serif` | Cormorant Garamond | Başlıklar |
| `--font-sans` | Inter | UI / gövde metni |

## 📱 Moderasyon

Fotoğraf moderasyonu için mimari hazır durumda:

- Yüklenen dosyalar `DRIVE_UPLOAD_FOLDER_ID` klasörüne gider
- Galeri yalnızca `DRIVE_GALLERY_FOLDER_ID` klasöründen okur
- İki farklı klasör kullanarak basit moderasyon yapılabilir:
  - Yeni fotoğraflar "incoming" klasörüne gelir
  - Onaylananlar "gallery" klasörüne taşınır
- Her dosyanın `description` alanında metadata (uploaderName, uploadedAt, approved) saklanır

## 🌐 Yayınlama

Vercel üzerine deploy edebilirsiniz:

```bash
npx vercel
```

- Ortam değişkenlerini Vercel dashboard'undan ayarlayın
- `GOOGLE_PRIVATE_KEY` değerini doğru biçimde (newline'lar korunarak) ekleyin

## 📝 İçerik Düzenleme

- **Tarih/isim**: `HeroSection.tsx`, `CountdownSection.tsx`, `FooterSection.tsx`
- **Program**: `ProgramSection.tsx` içindeki `PROGRAM` array'ini düzenleyin
- **Mekan**: `ProgramSection.tsx` içindeki `mapsLink` ve `location` alanlarını güncelleyin
- **Görseller**: `public/images/` klasöründeki `hero.png` ve `couple.png` dosyalarını değiştirin
