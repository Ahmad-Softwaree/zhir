import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/shared/scroll-to-top";
import Providers from "./providers";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { PageTransition } from "@/components/shared/page-transition";

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
  title: "FinanceTrack - Smart Expense Management",
  description:
    "Track expenses, manage budgets, and achieve your financial goals with our powerful expense management platform.",
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
            <Header />
            <main className="flex-1 min-h-screen">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <ScrollToTop />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
