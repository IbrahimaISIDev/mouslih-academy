import { MessageCircle } from "lucide-react";

export interface AuthHelpLineProps {
  text: string;
  linkLabel: string;
  href: string;
}

function AuthHelpLine({ text, linkLabel, href }: AuthHelpLineProps) {
  return (
    <div className="mt-7 flex items-center justify-center gap-2 text-sm text-text-muted lg:mt-0 lg:gap-2.5">
      <MessageCircle className="size-4 text-whatsapp-hover" strokeWidth={1.8} />
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}{" "}
        <span className="font-semibold text-whatsapp-hover">{linkLabel}</span>
      </a>
    </div>
  );
}

export { AuthHelpLine };
