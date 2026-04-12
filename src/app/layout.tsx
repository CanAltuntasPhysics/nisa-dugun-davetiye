import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nisa & Ömer — 2 Mayıs 2026",
  description:
    "Düğünümüze davetlisiniz. Nisa ve Ömer'in özel gününe siz de katılın.",
  keywords: ["düğün", "davetiye", "Nisa", "Ömer", "wedding"],
  openGraph: {
    title: "Nisa & Ömer — Düğünümüze Davetlisiniz",
    description: "2 Mayıs 2026 — Özel günümüze siz de katılın.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${inter.variable} ${pinyonScript.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
