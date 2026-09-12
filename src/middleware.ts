import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE = "mouslih_session";

/** Groupes de routes protégées (learner)/(checkout)/admin — comparées au chemin sans préfixe
 * de locale. Une vérification de présence de cookie seulement (pas de la signature du JWT :
 * ça nécessiterait une lib compatible Edge) ; une session invalide/expirée est de toute façon
 * rejetée par l'API au premier appel, geste dont les pages ne se remettent pas encore
 * gracieusement aujourd'hui — connu, à améliorer. */
const PROTECTED_PATTERNS = [
  /^\/tableau-de-bord(\/|$)/,
  /^\/profil(\/|$)/,
  /^\/formations\/[^/]+\/lecons(\/|$)/,
  /^\/commande(\/|$)/,
  /^\/admin(\/|$)/,
];

function stripLocalePrefix(pathname: string): string {
  const match = /^\/([a-z]{2})(\/|$)/.exec(pathname);
  if (match && routing.locales.includes(match[1] as (typeof routing.locales)[number])) {
    return pathname.slice(match[1].length + 1) || "/";
  }
  return pathname;
}

export default function middleware(request: NextRequest) {
  const pathWithoutLocale = stripLocalePrefix(request.nextUrl.pathname);
  const isProtected = PROTECTED_PATTERNS.some((pattern) => pattern.test(pathWithoutLocale));

  if (isProtected && !request.cookies.get(SESSION_COOKIE)) {
    const localeMatch = /^\/([a-z]{2})(\/|$)/.exec(request.nextUrl.pathname);
    const locale = localeMatch?.[1] ?? routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/connexion`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
