import { LiveRefresh } from "@/components/providers/live-refresh";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Les changements faits dans l'admin apparaissent aussi chez les visiteurs déjà présents. */}
      <LiveRefresh />
    </>
  );
}
