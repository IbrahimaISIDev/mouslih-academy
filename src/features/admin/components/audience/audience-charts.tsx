"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Graduation « propre » (1, 2, 5 × 10ⁿ) couvrant le maximum en 4 intervalles au plus. */
function niceScale(max: number): { top: number; ticks: number[] } {
  if (max <= 0) return { top: 4, ticks: [0, 1, 2, 3, 4] };
  const rough = max / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    ([1, 2, 5, 10].find((m) => m * magnitude >= rough) ?? 10) * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Math.round(v));
  return { top, ticks };
}

export interface DailyColumnsProps {
  /** `label` : la valeur déjà rédigée (« 12 visites »), préparée côté serveur. */
  data: { date: string; value: number; label: string }[];
  locale: string;
  tableCaption: string;
  dateHeader: string;
  valueHeader: string;
}

/** Colonnes par jour, une seule série (le titre de la carte dit ce qui est tracé : pas de légende). */
function DailyColumns({
  data,
  locale,
  tableCaption,
  dateHeader,
  valueHeader,
}: DailyColumnsProps) {
  const [active, setActive] = useState<number | null>(null);
  const number = new Intl.NumberFormat(locale);
  const shortDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const longDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const { top, ticks } = niceScale(Math.max(0, ...data.map((d) => d.value)));
  const labelIndexes = new Set([
    0,
    Math.floor((data.length - 1) / 2),
    data.length - 1,
  ]);
  const hovered = active !== null ? data[active] : null;

  return (
    <div>
      <div className="relative flex h-[220px] gap-3">
        {/* Axe des valeurs */}
        <div className="relative w-8 shrink-0 text-end text-[11px] text-text-faint tabular-nums">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute end-0 translate-y-1/2"
              style={{ bottom: `${(tick / top) * 100}%` }}
            >
              {number.format(tick)}
            </span>
          ))}
        </div>
        <div className="relative flex-1" onPointerLeave={() => setActive(null)}>
          {ticks.map((tick) => (
            <div
              key={tick}
              aria-hidden
              className="absolute inset-x-0 border-t border-hairline"
              style={{ bottom: `${(tick / top) * 100}%` }}
            />
          ))}
          <div className="absolute inset-0 flex items-end gap-0.5" dir="ltr">
            {data.map((d, i) => (
              <button
                key={d.date}
                type="button"
                aria-label={`${longDate.format(new Date(d.date))} : ${d.label}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex h-full min-w-0 flex-1 items-end justify-center outline-none"
              >
                <span
                  className={cn(
                    "block w-full max-w-6 rounded-t-[4px] transition-colors",
                    active === i ? "bg-chart-hover" : "bg-chart",
                    "group-focus-visible:ring-2 group-focus-visible:ring-green-800 group-focus-visible:ring-offset-1",
                  )}
                  style={{
                    height:
                      d.value > 0 ? `max(2px, ${(d.value / top) * 100}%)` : "0",
                  }}
                />
              </button>
            ))}
          </div>
          {hovered && active !== null && (
            <div
              role="status"
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-sm border border-border-subtle bg-surface px-3 py-2 shadow-sm"
              style={{ left: `${((active + 0.5) / data.length) * 100}%` }}
            >
              <p className="font-semibold whitespace-nowrap text-text tabular-nums">
                {hovered.label}
              </p>
              <p className="text-xs whitespace-nowrap text-text-muted">
                {longDate.format(new Date(hovered.date))}
              </p>
            </div>
          )}
        </div>
      </div>
      <div
        className="relative ms-11 mt-2 h-4 text-[11px] text-text-faint"
        dir="ltr"
      >
        {data.map((d, i) =>
          labelIndexes.has(i) ? (
            <span
              key={d.date}
              className={cn(
                "absolute whitespace-nowrap",
                i === 0
                  ? "start-0"
                  : i === data.length - 1
                    ? "end-0"
                    : "-translate-x-1/2",
              )}
              style={
                i !== 0 && i !== data.length - 1
                  ? { left: `${((i + 0.5) / data.length) * 100}%` }
                  : undefined
              }
            >
              {shortDate.format(new Date(d.date))}
            </span>
          ) : null,
        )}
      </div>
      <table className="sr-only">
        <caption>{tableCaption}</caption>
        <thead>
          <tr>
            <th>{dateHeader}</th>
            <th>{valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{longDate.format(new Date(d.date))}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface HorizontalBarsProps {
  rows: { key: string; label: string; value: number; detail?: string }[];
  locale: string;
  /** Valeur de référence pour la longueur des barres (par défaut : la plus grande). */
  max?: number;
}

/**
 * Barres horizontales d'une seule série : étiquette à gauche, valeur au bout de la barre
 * (toujours visible, donc aucune information réservée au survol).
 */
function HorizontalBars({ rows, locale, max }: HorizontalBarsProps) {
  const number = new Intl.NumberFormat(locale);
  const reference = Math.max(
    1,
    max ?? Math.max(0, ...rows.map((r) => r.value)),
  );

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li
          key={row.key}
          className="grid grid-cols-[148px_1fr] items-center gap-3"
        >
          <span className="truncate text-sm text-text-soft" title={row.label}>
            {row.label}
          </span>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="block h-4 rounded-e-[4px] bg-chart"
              style={{
                width:
                  row.value > 0
                    ? `max(2px, ${(row.value / reference) * 78}%)`
                    : "0",
              }}
            />
            <span className="shrink-0 text-sm font-semibold text-text tabular-nums">
              {number.format(row.value)}
              {row.detail && (
                <span className="ms-1.5 font-normal text-text-muted">
                  {row.detail}
                </span>
              )}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export { DailyColumns, HorizontalBars };
