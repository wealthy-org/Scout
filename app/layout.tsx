import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteMetadata } from "@/config/metadata";
import { TopProgressBar } from "@/components/layout/TopProgressBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0D746E] text-[#FFFDF7] font-sans selection:bg-[#FFD166] selection:text-[#042F2E]">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
