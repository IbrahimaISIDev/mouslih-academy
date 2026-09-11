import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export default async function NotFound() {
  const t = await getTranslations("states.notFound");

  return (
    <div className="relative grid min-h-screen place-items-center bg-bg px-6 text-center">
      <GeometricPattern variant="chevrons" opacity={0.08} className="pointer-events-none" />
      <div className="relative max-w-[420px]">
        <p className="mb-3.5 font-serif text-[72px] leading-none font-light text-gold-600">404</p>
        <h1 className="mb-3 font-serif text-2xl font-medium lg:text-[28px]">{t("title")}</h1>
        <p className="mb-7 text-[15px] leading-[1.65] text-text-muted">{t("body")}</p>
        <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button asChild>
            <Link href="/formations">{t("browseCoursesButton")}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">{t("homeButton")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
