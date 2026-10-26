import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saptarishi-hotel.com"),
  title: "Saptarishi | A residence of seven stars",
  description:
    "An ultra-luxury 7-star interactive architectural sanctuary. Seven stars. One sky. Experience an orchestrated walkthrough of pure elegance and architectural serenity.",
  keywords: [
    "Saptarishi",
    "Luxury Hotel",
    "7 Star Hotel",
    "Ultra Luxury",
    "Architectural Hotel",
    "Bespoke Hospitality",
    "Signature Suites",
  ],
  authors: [{ name: "Saptarishi Hospitality" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Saptarishi | A residence of seven stars",
    description:
      "Seven stars. One sky. An interactive cinematic journey through one of the world's finest architectural residences.",
    url: "https://saptarishi-hotel.com",
    siteName: "Saptarishi",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Saptarishi - A residence of seven stars",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saptarishi | A residence of seven stars",
    description: "Seven stars. One sky. An interactive luxury hotel experience.",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#100D0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${inter.variable}`}>
      <body className="bg-[#FAF7F2] text-[#100D0B] antialiased selection:bg-[#D98E5F] selection:text-[#FAF7F2]">
        {children}
      </body>
    </html>
  );
}
