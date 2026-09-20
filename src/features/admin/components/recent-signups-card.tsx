export interface RecentSignup {
  id: string;
  name: string;
  initials: string;
  city: string;
  timeAgo: string;
}

export interface RecentSignupsCardProps {
  title: string;
  signups: RecentSignup[];
}

function RecentSignupsCard({ title, signups }: RecentSignupsCardProps) {
  return (
    <div className="border border-border-subtle bg-surface p-5.5">
      <p className="mb-4.5 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">{title}</p>
      <div className="flex flex-col gap-3.5">
        {signups.map((signup) => (
          <div key={signup.id} className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-green-100 font-serif text-[13px] text-green-ink">
              {signup.initials}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{signup.name}</p>
              <p className="text-xs text-text-muted">
                {signup.city} · {signup.timeAgo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { RecentSignupsCard };
