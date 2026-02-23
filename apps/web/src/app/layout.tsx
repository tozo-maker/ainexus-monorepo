import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ainexus.com'),
  title: "AI Nexus - The Ultimate AI Intelligence Hub",
  description: "Discover, compare, and track the entire AI ecosystem — tools, LLMs, platforms, news, and videos — updated daily.",
  keywords: ["AI Directory", "AI Tools", "LLM Benchmark", "AI News", "Artificial Intelligence", "AI Comparison"],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "AI Nexus - The Ultimate AI Intelligence Hub",
    description: "Discover, compare, and track the entire AI ecosystem — tools, LLMs, platforms, news, and videos — updated daily.",
    siteName: "AINexus",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Nexus - The Ultimate AI Intelligence Hub",
    description: "Discover, compare, and track the entire AI ecosystem — tools, LLMs, platforms, news, and videos — updated daily.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
