import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Weknoq", template: "%s — Weknoq" },
  description:
    "The world's knowledge, finally looped together. Discover the best educational videos across every topic, curated into learning paths.",
  keywords: ["learning", "education", "videos", "courses", "knowledge"],
  openGraph: {
    title: "Weknoq",
    description: "Learn everything, from everywhere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="bg-ink text-paper font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
