import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { getCourses } from "@/features/catalog/api/get-courses";
import { getTestimonials } from "@/features/catalog/api/get-testimonials";
import { buildFooterColumns } from "@/lib/footer-columns";
import { TestimonialsBrowser } from "@/features/catalog/components/testimonials-browser";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = { title: "Témoignages — Mouslih Academy" };

const WHATSAPP_URL = "https://wa.me/221771542311";

interface TemoignagesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
}

export default async function TemoignagesPage({
  params,
  searchParams,
}: TemoignagesPageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const { filter } = await searchParams;

  const [tNav, tCommon, tTestimonials, courses, testimonials] =
    await Promise.all([
      getTranslations("nav"),
      getTranslations("common"),
      getTranslations("testimonials"),
      getCourses(),
      getTestimonials(),
    ]);

  const navItems = [
    { label: tNav("home"), href: "/" },
    { label: tNav("formations"), href: "/formations" },
    { label: tNav("testimonials"), href: "/temoignages", active: true },
    { label: tNav("contact"), href: "/contact" },
  ];

  const footerColumns = buildFooterColumns(
    tCommon.raw("footer.columns") as { title: string; items: string[] }[],
  );

  return (
    <div className="pb-24 lg:pb-0">
      <PublicHeader
        navItems={navItems}
        loginLabel={tNav("login")}
        loginHref="/connexion"
        signupLabel={tNav("signup")}
        signupHref="/inscription"
      />

      <TestimonialsBrowser
        testimonials={testimonials}
        courses={courses}
        locale={locale}
        initialFilter={filter ?? "all"}
      />

      <Footer
        columns={footerColumns}
        whatsappHref={WHATSAPP_URL}
        whatsappLabel={tCommon("footer.whatsappNumber")}
        copyright={tCommon("footer.copyright")}
        paymentNote={tCommon("footer.paymentNote")}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg/82 px-4 py-3 backdrop-blur-md lg:hidden">
        <Button className="w-full" asChild>
          <Link href="/formations">{tTestimonials("mobileCta")}</Link>
        </Button>
      </div>
    </div>
  );
}
