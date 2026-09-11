import { MessageCircle } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export interface WhatsAppButtonProps {
  href: string;
  label: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

function WhatsAppButton({ href, label, size, className }: WhatsAppButtonProps) {
  return (
    <Button variant="whatsapp" size={size} className={className} asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" strokeWidth={1.5} />
        {label}
      </a>
    </Button>
  );
}

export { WhatsAppButton };
