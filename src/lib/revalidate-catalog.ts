"use server";

import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { CATALOG_TAG } from "@/lib/public-fetch";

/**
 * Périme le cache des pages publiques juste après une modification faite dans l'admin
 * (témoignage, formation, vidéo…), pour qu'elle soit visible tout de suite sur le site plutôt
 * qu'au bout de 5 minutes. Réservé aux visiteurs connectés (l'admin) ; sans danger de toute
 * façon : cela ne fait que relire les données publiques à la visite suivante.
 */
export async function revalidateCatalog(): Promise<void> {
  if (!(await getSession())) return;
  revalidateTag(CATALOG_TAG);
}
