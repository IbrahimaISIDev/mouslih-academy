"use server";

import { redirect } from "next/navigation";
import { USE_MOCKS } from "@/lib/api-client";
import { clearSession, getSession } from "@/lib/session";
import type { Locale } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** `destination` : page de connexion vers laquelle revenir (« admin/connexion » pour l'admin). */
export async function logout(
  locale: Locale,
  destination: "connexion" | "admin/connexion" = "connexion",
): Promise<void> {
  if (!USE_MOCKS) {
    const session = await getSession();
    if (session) {
      // Best-effort : révoque le refresh token côté API. Une erreur ici ne doit pas empêcher la
      // déconnexion locale (le cookie est supprimé de toute façon juste après).
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      }).catch(() => undefined);
    }
  }

  await clearSession();
  // Utilisée comme action de formulaire, la fonction peut recevoir un FormData en 2e argument :
  // toute valeur inattendue renvoie vers la connexion apprenant.
  const target = destination === "admin/connexion" ? "admin/connexion" : "connexion";
  redirect(`/${locale}/${target}`);
}
