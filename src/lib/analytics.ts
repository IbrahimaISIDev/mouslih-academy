"use client";

/**
 * Mesure d'audience maison, SANS cookie ni identifiant persistant :
 * - un numéro de visite tiré au hasard, gardé seulement le temps de l'onglet (sessionStorage) ;
 * - aucune donnée personnelle (ni nom, ni e-mail, ni adresse IP stockée côté serveur) ;
 * - la provenance (TikTok, WhatsApp…) est déduite du lien utm_source ou du site d'origine.
 *
 * L'envoi part directement vers l'API (pas via /api/backend) pour que la limite de débit
 * s'applique par visiteur, et en `text/plain` + `no-cors` : aucune requête préalable CORS,
 * aucune réponse attendue. Une mesure ne doit jamais gêner la navigation : tout échec est ignoré.
 */

export type AnalyticsEventName =
  | "page_view"
  | "video_play"
  | "video_complete"
  | "signup"
  | "checkout_start"
  | "payment_success";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const SESSION_KEY = "ma_visit";
const SOURCE_KEY = "ma_source";
const CAMPAIGN_KEY = "ma_campaign";

const REFERRER_SOURCES: [RegExp, string][] = [
  [/tiktok\./, "tiktok"],
  [/(whatsapp\.|wa\.me)/, "whatsapp"],
  [/google\./, "google"],
  [/(facebook\.|fb\.)/, "facebook"],
  [/instagram\./, "instagram"],
  [/(youtube\.|youtu\.be)/, "youtube"],
];
const KNOWN_SOURCES = new Set([
  ...REFERRER_SOURCES.map(([, s]) => s),
  "direct",
  "autre",
]);

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function sessionId(store: Storage | null): string {
  const existing = store?.getItem(SESSION_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  store?.setItem(SESSION_KEY, id);
  return id;
}

/** Provenance fixée au premier affichage de la visite (les pages suivantes ont le site pour référent). */
function attribution(store: Storage | null): {
  source: string;
  utmCampaign?: string;
} {
  const saved = store?.getItem(SOURCE_KEY);
  if (saved) {
    return {
      source: saved,
      utmCampaign: store?.getItem(CAMPAIGN_KEY) ?? undefined,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source")?.trim().toLowerCase();
  let source = "direct";
  if (utm) {
    source = KNOWN_SOURCES.has(utm)
      ? utm
      : (REFERRER_SOURCES.find(([re]) => re.test(utm))?.[1] ?? "autre");
  } else if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host !== window.location.hostname) {
        source = REFERRER_SOURCES.find(([re]) => re.test(host))?.[1] ?? "autre";
      }
    } catch {
      // Référent illisible : visite comptée en accès direct.
    }
  }
  const utmCampaign =
    params.get("utm_campaign")?.trim().slice(0, 60) || undefined;

  store?.setItem(SOURCE_KEY, source);
  if (utmCampaign) store?.setItem(CAMPAIGN_KEY, utmCampaign);
  return { source, utmCampaign };
}

function device(): "mobile" | "desktop" {
  // matchMedia peut manquer (vieux navigateurs, environnements de test) : on retombe sur la largeur.
  const narrow =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 768px)").matches
      : window.innerWidth <= 768;
  return narrow ? "mobile" : "desktop";
}

export function track(
  name: AnalyticsEventName,
  extra: { lessonId?: string; path?: string } = {},
): void {
  if (typeof window === "undefined" || !API_BASE_URL) return;
  const path = extra.path ?? window.location.pathname;
  // L'espace d'administration n'est pas une audience.
  if (/^\/(fr|en|ar)\/admin(\/|$)/.test(path)) return;

  try {
    const store = storage();
    const body = JSON.stringify({
      name,
      path,
      sessionId: sessionId(store),
      ...attribution(store),
      locale: document.documentElement.lang || undefined,
      device: device(),
      lessonId: extra.lessonId,
    });
    void fetch(`${API_BASE_URL}/api/analytics/events`, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      credentials: "omit",
      headers: { "Content-Type": "text/plain" },
      body,
    }).catch(() => undefined);
  } catch {
    // Mesure « au mieux » : jamais d'erreur visible.
  }
}

/** Comme `track`, mais une seule fois par visite pour une même clé (ex. un paiement rechargé). */
export function trackOnce(
  key: string,
  name: AnalyticsEventName,
  extra?: { lessonId?: string; path?: string },
): void {
  const store = typeof window === "undefined" ? null : storage();
  const flag = `ma_once_${key}`;
  if (store?.getItem(flag)) return;
  store?.setItem(flag, "1");
  track(name, extra);
}
