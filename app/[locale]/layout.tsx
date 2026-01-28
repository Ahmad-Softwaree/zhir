import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/shared/scroll-to-top";
import Providers from "./providers";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zhir - AI Chat Assistant",
  description:
    "Zhir is an AI-powered chat assistant designed to help you with a variety of tasks, from answering questions to providing recommendations.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <html
      dir={locale === "en" ? "ltr" : "rtl"}
      lang={locale}
      suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${
          locale == "en"
            ? "english_font"
            : locale == "ar"
            ? "arabic_font"
            : "kurdish_font"
        }  antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <NextIntlClientProvider>
          <Providers>
            {children}
            <ScrollToTop />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
