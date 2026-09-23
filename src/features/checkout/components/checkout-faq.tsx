"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface CheckoutFaqProps {
  items: FAQItem[];
  className?: string;
}

export function CheckoutFaq({ items, className = "" }: CheckoutFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("border border-border-subtle bg-surface", className)}>
      <div className="p-5">
        <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
          Questions fréquentes
        </p>
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-sm border border-border-subtle bg-bg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-text-soft transition-colors hover:bg-border-subtle"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    openIndex === index ? "rotate-180" : ""
                  )}
                  strokeWidth={2}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-3.5 pt-0 text-sm leading-[1.65] text-text-muted">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
