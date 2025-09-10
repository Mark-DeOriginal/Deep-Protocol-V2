import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Deep Protocol — Your Gateway to Simple Liquidity Provisioning",
  description:
    "Solana’s first AI-powered liquidity pool aggregator. Instantly compare APYs, deposit in one click, and optimize yields with $DEEP.",
  openGraph: {
    title: "Deep Protocol — Your Gateway to Simple Liquidity Provisioning",
    description:
      "Solana’s first AI-powered liquidity pool aggregator. Instantly compare APYs, deposit in one click, and optimize yields with $DEEP.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 1200,
        alt: "Deep Protocol Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deep Protocol — Your Gateway to Simple Liquidity Provisioning",
    description:
      "Solana’s first AI-powered liquidity pool aggregator. Instantly compare APYs, deposit in one click, and optimize yields with $DEEP.",
    images: ["/opengraph-twitter.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Open Graph and Twitter meta tags for social sharing */}
        <meta property="og:image" content="/opengraph.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta
          property="og:image:alt"
          content="Deep Protocol Open Graph Image"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/opengraph-twitter.png" />
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ClientBody>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Analytics />
              </div>
            </ClientBody>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
