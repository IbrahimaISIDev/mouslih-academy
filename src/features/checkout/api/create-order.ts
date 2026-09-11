import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { orders } from "@/mocks/orders";

function generateRef(): string {
  return `TX-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

export async function createOrder(
  courseId: string,
  userId: string,
  amountXof: number,
): Promise<{ ref: string; waveCheckoutUrl: string }> {
  if (!USE_MOCKS) {
    return apiFetch<{ ref: string; waveCheckoutUrl: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify({ courseId, userId, amountXof }),
    });
  }

  await sleep(400);

  const ref = generateRef();

  orders.push({
    ref,
    userId,
    courseId,
    amountXof,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // En production, ceci pointerait vers l'URL de paiement Wave réelle (domaine externe).
  // Faute de bac à sable Wave, la démo simule le retour en pointant vers notre propre
  // écran de confirmation, atteint via `window.location.assign` comme le ferait un vrai
  // retour de redirection externe.
  return { ref, waveCheckoutUrl: `/commande/${ref}/confirmation` };
}
