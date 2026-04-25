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

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** (özel altın saat tasarım tokenleri ile)
- **Google Drive API** (fotoğraf depolama)
- **QR Code React** (QR kod oluşturma)

## 🚀 Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın

Proje kökünde `.env.local` oluşturun:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_DRIVE_API_KEY=
DRIVE_GALLERY_FOLDER_ID=
DRIVE_UPLOAD_FOLDER_ID=
```

### 3. Google Drive API Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/) üzerinde yeni bir proje oluşturun
2. **Google Drive API**'yi etkinleştirin
3. **OAuth consent screen** kurulumunu tamamlayın
   - Test modundaysa kendi Google hesabınızı test kullanıcısı olarak ekleyin
4. **OAuth Client ID** oluşturun
   - Application type: **Web application**
   - Authorized redirect URI:
     - Lokal: `http://localhost:3000/api/auth/callback`
     - Yayın: `https://alan-adiniz.com/api/auth/callback`
5. Client ID ve Client Secret değerlerini `.env.local` içine ekleyin
6. Google Drive'da iki klasör oluşturun:
   - **Upload Klasörü**: Yeni yüklemeler buraya gelir
   - **Gallery Klasörü**: Galeriye yalnızca bu klasördeki dosyalar gösterilir
   - *Basit kurulumda ikisi aynı klasör olabilir*
   - Yüklenen görsellerin galeride hemen görünmesi için `DRIVE_UPLOAD_FOLDER_ID` ve `DRIVE_GALLERY_FOLDER_ID` aynı klasör ID'si olmalıdır
7. Klasör ID'lerini `.env.local`'e ekleyin
8. Upload klasörünü Google Drive'da **Anyone with the link → Editor** olarak paylaşın
9. Geliştirme sunucusunu başlatıp `http://localhost:3000/api/auth/google` adresini açın
10. Drive klasörünün sahibi olan Google hesabıyla izin verin
11. Callback sayfasındaki `GOOGLE_REFRESH_TOKEN` değerini `.env.local` ve Vercel ortam değişkenlerine ekleyin

> **Klasör ID**: Drive'da klasörü açtığınızda URL'deki son kısım: `drive.google.com/drive/folders/{FOLDER_ID}`
>
> **Önemli**: Public klasör akışında OAuth zorunlu değildir. `GOOGLE_DRIVE_API_KEY` eklerseniz galeri resmi Drive API ile public klasörü listeler; API key yoksa public Drive klasör sayfasından fallback okuma yapılır. OAuth kullanacaksanız, misafirlerin Drive klasörüne doğrudan yüklediği dosyaları okuyabilmek için token'ın `drive.readonly` kapsamıyla üretilmiş olması gerekir.

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
│       ├── [id]/media/route.ts     # GET — Drive medyasını proxy'ler
│       └── fix-permissions/route.ts # POST — eski dosya izinlerini düzeltir
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
- OAuth redirect URI listesine yayın alan adınızı ekleyin
- `GOOGLE_REFRESH_TOKEN` değerini yeni kapsamlarla ürettikten sonra Vercel'e ekleyin

## 📝 İçerik Düzenleme

- **Tarih/isim**: `HeroSection.tsx`, `CountdownSection.tsx`, `FooterSection.tsx`
- **Program**: `ProgramSection.tsx` içindeki `PROGRAM` array'ini düzenleyin
- **Mekan**: `ProgramSection.tsx` içindeki `mapsLink` ve `location` alanlarını güncelleyin
- **Görseller**: `public/images/` klasöründeki `hero.png` ve `couple.png` dosyalarını değiştirin
