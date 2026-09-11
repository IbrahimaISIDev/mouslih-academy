import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export interface CoverImageCardProps {
  title: string;
  replaceLabel: string;
}

function CoverImageCard({ title, replaceLabel }: CoverImageCardProps) {
  return (
    <div className="border border-border-subtle bg-surface p-5.5">
      <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">{title}</p>
      <div className="relative mb-3.5 aspect-16/10 overflow-hidden bg-green-700">
        <GeometricPattern variant="khatam" opacity={0.6} />
      </div>
      <button
        type="button"
        className="w-full rounded-sm border border-border-strong px-4 py-2.75 text-sm font-semibold text-green-ink"
      >
        {replaceLabel}
      </button>
    </div>
  );
}

export { CoverImageCard };
