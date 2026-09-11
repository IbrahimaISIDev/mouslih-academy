"use client";

import { SectionError } from "@/components/patterns/section-error";

export interface SectionErrorDemoProps {
  title: string;
  body: string;
  retryLabel: string;
}

/** Wrapper client : SectionError attend un callback, qui ne peut pas traverser la frontière
 *  serveur → composant sans "use client" (la page /etats est un composant serveur). */
function SectionErrorDemo({ title, body, retryLabel }: SectionErrorDemoProps) {
  return <SectionError title={title} body={body} retryLabel={retryLabel} onRetry={() => {}} />;
}

export { SectionErrorDemo };
