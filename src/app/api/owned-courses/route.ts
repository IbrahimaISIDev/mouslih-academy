import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-fetch";
import { getSession } from "@/lib/session";

/**
 * Identifiants des formations achetées par le visiteur (voir OwnedSwitch). Sans session, répond
 * tout de suite une liste vide — sans réveiller l'API pour les visiteurs anonymes.
 */
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  if (!(await getSession())) return NextResponse.json([], { headers });
  try {
    const response = await backendFetch("/api/me/enrollments");
    if (!response.ok) return NextResponse.json([], { headers });
    const enrollments = (await response.json()) as { courseId: string }[];
    return NextResponse.json(
      enrollments.map((e) => e.courseId),
      { headers },
    );
  } catch {
    return NextResponse.json([], { headers });
  }
}
