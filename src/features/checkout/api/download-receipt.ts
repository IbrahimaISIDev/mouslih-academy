import { ClientApiError } from "@/lib/client-fetch";

/**
 * `GET /api/orders/:ref/receipt` renvoie un PDF, pas du JSON : pas clientApiFetch (qui décode
 * toujours la réponse en JSON), un fetch brut + déclenchement de téléchargement via un lien
 * <a download> temporaire, le mécanisme standard pour un blob obtenu par fetch.
 */
export async function downloadReceipt(ref: string): Promise<void> {
  const response = await fetch(`/api/backend/api/orders/${ref}/receipt`);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body && typeof body.message === "string" ? body.message : `GET receipt → ${response.status}`;
    throw new ClientApiError(response.status, message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `recu-${ref}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
