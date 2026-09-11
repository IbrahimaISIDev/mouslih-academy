import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Spectral,
  Work_Sans,
  Amiri,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Direction } from "radix-ui";
import { routing } from "@/i18n/routing";
import { isRtl } from "@/lib/rtl";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { OfflineBanner } from "@/components/patterns/offline-banner";
import { PageTransition } from "@/components/patterns/page-transition";
import "../globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mouslih Academy",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${spectral.variable} ${workSans.variable} ${amiri.variable} ${plexArabic.variable}`}
    >
      <body>
        <NuqsAdapter>
          <NextIntlClientProvider>
            <Direction.Provider dir={dir}>
              <QueryProvider>
                <OfflineBanner />
                <PageTransition>{children}</PageTransition>
                <Toaster />
              </QueryProvider>
            </Direction.Provider>
          </NextIntlClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
