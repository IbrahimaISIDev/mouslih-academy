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

  const response = await backendFetch(target, {
    method: request.method,
    body: hasBody ? await request.text() : undefined,
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
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
