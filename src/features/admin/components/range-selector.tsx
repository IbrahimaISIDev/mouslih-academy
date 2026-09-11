"use client";

import { useState } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

const RANGE_VALUES = ["30d", "90d", "year"] as const;
export type DashboardRange = (typeof RANGE_VALUES)[number];

export interface RangeSelectorProps {
  initialRange: DashboardRange;
  labels: Record<DashboardRange, string>;
}

function RangeSelector({ initialRange, labels }: RangeSelectorProps) {
  const [range, setRangeLocal] = useState<DashboardRange>(initialRange);
  const [, setRangeUrl] = useQueryState(
    "range",
    parseAsStringEnum<DashboardRange>([...RANGE_VALUES])
      .withDefault("30d")
      .withOptions({ history: "replace" }),
  );

  function setRange(value: DashboardRange) {
    setRangeLocal(value);
    setRangeUrl(value === "30d" ? null : value);
  }

  return (
    <div className="flex gap-2">
      {RANGE_VALUES.map((value) => {
        const active = value === range;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setRange(value)}
            className={cn(
              "rounded-sm border px-3.5 py-2.5 text-[13px] font-semibold",
              active
                ? "border-green-700 bg-green-700 text-green-ink"
                : "border-border-strong text-text-soft",
            )}
          >
            {labels[value]}
          </button>
        );
      })}
    </div>
  );
}

export { RangeSelector };
