import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { Order } from "@/lib/types";
import { orders } from "@/mocks/orders";

/** Délai simulé avant qu'une commande fraîchement créée soit confirmée par le stub Wave —
 *  même valeur que côté API (OrdersService.AUTO_CONFIRM_AFTER_MS) et que le mock. */
const AUTO_CONFIRM_AFTER_MS = 6_000;

/**
 * Variante client-safe de get-order.ts, pour le polling dans PaymentResult (composant client).
 * get-order.ts importe apiFetch, qui touche `next/headers` côté serveur : un composant client
 * ne peut pas l'importer, même indirectement (Next.js refuse de le bundler). Voir
 * lib/client-fetch.ts pour le détail de cette contrainte.
 */
export async function getOrderClient(ref: string): Promise<Order | null> {
  if (!USE_MOCKS) {
    try {
      return await clientApiFetch<Order>(`/api/orders/${ref}`);
    } catch {
      return null;
    }
  }

  await sleep(400);

  const order = orders.find((o) => o.ref === ref);
  if (!order) return null;

  if (order.status === "pending" && Date.now() - new Date(order.createdAt).getTime() > AUTO_CONFIRM_AFTER_MS) {
    order.status = "paid";
  }

  return order;
}
