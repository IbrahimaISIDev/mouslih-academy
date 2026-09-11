"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Déclenche une erreur volontaire pour vérifier que error.tsx (et non l'écran Next par défaut)
 *  s'affiche. Le composant doit être un client component : throw pendant le render côté
 *  serveur planterait la requête au lieu d'être capté par le error boundary React. */
function ThrowErrorButton({ label }: { label: string }) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Erreur de démonstration — déclenchée depuis /etats");
  }

  return (
    <Button variant="destructive" onClick={() => setShouldThrow(true)}>
      {label}
    </Button>
  );
}

export { ThrowErrorButton };
