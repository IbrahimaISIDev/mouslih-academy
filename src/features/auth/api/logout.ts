"use server";

import { redirect } from "next/navigation";
import { USE_MOCKS } from "@/lib/api-client";
import { clearSession, getSession } from "@/lib/session";
import type { Locale } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function logout(locale: Locale): Promise<void> {
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
  redirect(`/${locale}/connexion`);
}
