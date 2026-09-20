import { Monitor } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("admin.narrowScreen");

  return (
    <>
      <div className="hidden lg:block">{children}</div>
      <div className="grid min-h-screen place-items-center bg-bg px-6 text-center lg:hidden">
        <div className="max-w-[360px]">
          <Monitor className="mx-auto mb-5 size-9 text-text-faint" strokeWidth={1.4} />
          <p className="mb-2.5 font-serif text-xl font-medium">{t("title")}</p>
          <p className="text-[15px] leading-[1.6] text-text-muted">{t("body")}</p>
        </div>
      </div>
    </>
  );
}
