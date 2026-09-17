import { PublicHeader } from "@/components/layout/public-header";
import { Footer, type FooterColumn } from "@/components/layout/footer";
import { SectionEyebrow } from "@/components/patterns/section-eyebrow";

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPageLayoutProps {
  navItems: { label: string; href: string; active?: boolean }[];
  loginLabel: string;
  signupLabel: string;
  footerColumns: FooterColumn[];
  whatsappHref: string;
  whatsappLabel: string;
  copyright: string;
  paymentNote: string;
  eyebrow: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

function LegalPageLayout({
  navItems,
  loginLabel,
  signupLabel,
  footerColumns,
  whatsappHref,
  whatsappLabel,
  copyright,
  paymentNote,
  eyebrow,
  title,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  return (
    <div>
      <PublicHeader
        navItems={navItems}
        loginLabel={loginLabel}
        loginHref="/connexion"
        signupLabel={signupLabel}
        signupHref="/inscription"
      />

      <div className="mx-auto max-w-[720px] px-5 py-12 sm:px-6 lg:px-0 lg:py-20">
        <SectionEyebrow className="mb-3">{eyebrow}</SectionEyebrow>
        <h1 className="mb-2 font-serif text-[28px] leading-[1.2] font-medium lg:text-[38px]">{title}</h1>
        <p className="mb-10 text-sm text-text-faint lg:mb-14">{lastUpdated}</p>

        <div className="flex flex-col gap-9">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-3 font-serif text-xl font-semibold">{section.heading}</h2>
              <div className="flex flex-col gap-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-[1.7] text-text-soft">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer
        columns={footerColumns}
        whatsappHref={whatsappHref}
        whatsappLabel={whatsappLabel}
        copyright={copyright}
        paymentNote={paymentNote}
      />
    </div>
  );
}

export { LegalPageLayout };
