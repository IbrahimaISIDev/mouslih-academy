"use client";

import { useState } from "react";
import type { Level } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CourseSettingsCardProps {
  title: string;
  levelLabel: string;
  levelOptions: Record<Level, string>;
  initialLevel: Level;
  priceLabel: string;
  initialPriceXof: number;
  freePreviewLabel: string;
  freePreviewHelp: string;
  certificateLabel: string;
  certificateHelp: string;
  voiceCorrectionLabel: string;
  voiceCorrectionHelp: string;
  initialHasCertificate: boolean;
  initialHasVoiceCorrection: boolean;
}

function ToggleRow({
  label,
  help,
  checked,
  onCheckedChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="mb-0.5 text-sm font-medium">{label}</p>
        <p className="text-xs text-text-muted">{help}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function CourseSettingsCard({
  title,
  levelLabel,
  levelOptions,
  initialLevel,
  priceLabel,
  initialPriceXof,
  freePreviewLabel,
  freePreviewHelp,
  certificateLabel,
  certificateHelp,
  voiceCorrectionLabel,
  voiceCorrectionHelp,
  initialHasCertificate,
  initialHasVoiceCorrection,
}: CourseSettingsCardProps) {
  const [level, setLevel] = useState<Level>(initialLevel);
  const [freePreview, setFreePreview] = useState(true);
  const [hasCertificate, setHasCertificate] = useState(initialHasCertificate);
  const [hasVoiceCorrection, setHasVoiceCorrection] = useState(initialHasVoiceCorrection);

  return (
    <div className="border border-border-subtle bg-surface p-5.5">
      <p className="mb-4.5 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">{title}</p>
      <div className="flex flex-col gap-4.5">
        <div>
          <Label htmlFor="course-level" className="mb-2 block">
            {levelLabel}
          </Label>
          <Select value={level} onValueChange={(value) => setLevel(value as Level)}>
            <SelectTrigger id="course-level" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">{levelOptions.beginner}</SelectItem>
              <SelectItem value="intermediate">{levelOptions.intermediate}</SelectItem>
              <SelectItem value="advanced">{levelOptions.advanced}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="course-price" className="mb-2 block">
            {priceLabel}
          </Label>
          <Input
            id="course-price"
            type="number"
            className="tabular-nums"
            defaultValue={initialPriceXof}
          />
        </div>

        <ToggleRow label={freePreviewLabel} help={freePreviewHelp} checked={freePreview} onCheckedChange={setFreePreview} />
        <ToggleRow
          label={certificateLabel}
          help={certificateHelp}
          checked={hasCertificate}
          onCheckedChange={setHasCertificate}
        />
        <ToggleRow
          label={voiceCorrectionLabel}
          help={voiceCorrectionHelp}
          checked={hasVoiceCorrection}
          onCheckedChange={setHasVoiceCorrection}
        />
      </div>
    </div>
  );
}

export { CourseSettingsCard };
