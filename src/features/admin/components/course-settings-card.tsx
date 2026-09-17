"use client";

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
  level: Level;
  onLevelChange: (level: Level) => void;
  priceLabel: string;
  priceXof: number;
  onPriceChange: (priceXof: number) => void;
  certificateLabel: string;
  certificateHelp: string;
  voiceCorrectionLabel: string;
  voiceCorrectionHelp: string;
  hasCertificate: boolean;
  onHasCertificateChange: (value: boolean) => void;
  hasVoiceCorrection: boolean;
  onHasVoiceCorrectionChange: (value: boolean) => void;
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
  level,
  onLevelChange,
  priceLabel,
  priceXof,
  onPriceChange,
  certificateLabel,
  certificateHelp,
  voiceCorrectionLabel,
  voiceCorrectionHelp,
  hasCertificate,
  onHasCertificateChange,
  hasVoiceCorrection,
  onHasVoiceCorrectionChange,
}: CourseSettingsCardProps) {
  return (
    <div className="border border-border-subtle bg-surface p-5.5">
      <p className="mb-4.5 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">{title}</p>
      <div className="flex flex-col gap-4.5">
        <div>
          <Label htmlFor="course-level" className="mb-2 block">
            {levelLabel}
          </Label>
          <Select value={level} onValueChange={(value) => onLevelChange(value as Level)}>
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
            value={priceXof}
            onChange={(e) => onPriceChange(Number(e.target.value) || 0)}
          />
        </div>

        <ToggleRow
          label={certificateLabel}
          help={certificateHelp}
          checked={hasCertificate}
          onCheckedChange={onHasCertificateChange}
        />
        <ToggleRow
          label={voiceCorrectionLabel}
          help={voiceCorrectionHelp}
          checked={hasVoiceCorrection}
          onCheckedChange={onHasVoiceCorrectionChange}
        />
      </div>
    </div>
  );
}

export { CourseSettingsCard };
