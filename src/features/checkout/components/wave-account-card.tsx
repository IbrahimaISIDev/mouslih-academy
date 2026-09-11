"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface WaveAccountCardProps {
  title: string;
  phoneLabel: string;
  initialPhone: string;
  useOtherNumberLabel: string;
  helpText: string;
}

function WaveAccountCard({ title, phoneLabel, initialPhone, useOtherNumberLabel, helpText }: WaveAccountCardProps) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(initialPhone);

  return (
    <div className="border border-border-subtle bg-surface p-6.5 lg:p-7">
      <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">{title}</p>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
        <div className="w-full flex-1 sm:max-w-[300px]">
          <label className="mb-2 block text-sm font-medium">{phoneLabel}</label>
          {editing ? (
            <div className="flex items-center gap-2.5 rounded-sm border border-border-strong bg-surface px-3.5">
              <span className="text-[15px] text-text-muted">+221</span>
              <span className="h-4.5 w-px bg-border-subtle" />
              <Input
                value={phone.replace("+221 ", "")}
                onChange={(e) => setPhone(`+221 ${e.target.value}`)}
                className="border-none px-0 shadow-none focus-visible:shadow-none"
              />
            </div>
          ) : (
            <div className="flex h-11 items-center gap-2.5 rounded-sm border border-border-strong bg-surface px-3.5">
              <span className="text-[15px] text-text-muted">+221</span>
              <span className="h-4.5 w-px bg-border-subtle" />
              <span className="text-[15px]">{phone.replace("+221 ", "")}</span>
            </div>
          )}
        </div>
        <Button type="button" variant="secondary" onClick={() => setEditing((v) => !v)}>
          {useOtherNumberLabel}
        </Button>
      </div>

      <div className="mt-4.5 flex items-center gap-2.5 border border-border-subtle bg-bg px-3.5 py-3 text-sm text-text-muted">
        <Info className="size-[17px] shrink-0" strokeWidth={1.6} />
        {helpText}
      </div>
    </div>
  );
}

export { WaveAccountCard };
