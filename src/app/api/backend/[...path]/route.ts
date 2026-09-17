/**
 * Proxy server-only vers l'API réelle, pour les rares appels faits depuis le navigateur
 * (le polling du statut de commande — voir PaymentResult). Le navigateur envoie son cookie de
 * session httpOnly (1re partie, même origine) ; on le lit ici et on relaie le jeton d'accès en
 * Authorization vers l'API, sur son propre domaine. Les Server Components n'ont pas besoin de
 * ce détour : voir apiFetch dans lib/api-client.ts.
 */
import { type NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-fetch";

async function handle(request: NextRequest, path: string[]): Promise<NextResponse> {
  const target = `/${path.join("/")}${request.nextUrl.search}`;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  // arrayBuffer() (pas text()) : relais binaire-safe, nécessaire pour l'upload multipart de
  // couverture (voir uploadCourseCover) — un .text() en UTF-8 corromprait les octets de l'image.
  // On relaie aussi le Content-Type d'origine (avec son boundary multipart), sinon backendFetch
  // forcerait application/json par défaut et l'API ne pourrait plus parser le corps.
  const contentType = request.headers.get("content-type");

  const response = await backendFetch(target, {
    method: request.method,
    body: hasBody ? await request.arrayBuffer() : undefined,
    headers: contentType ? { "Content-Type": contentType } : undefined,
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  // arrayBuffer() ici aussi : un .text() corromprait un PDF (reçu de commande) ou toute autre
  // réponse binaire de la même façon qu'un corps de requête mal relayé (voir plus haut).
  const body = await response.arrayBuffer();
  const contentDisposition = response.headers.get("Content-Disposition");
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      ...(contentDisposition ? { "Content-Disposition": contentDisposition } : {}),
    },
  });
}

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  return handle(request, (await params).path);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  return handle(request, (await params).path);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return handle(request, (await params).path);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return handle(request, (await params).path);
}
