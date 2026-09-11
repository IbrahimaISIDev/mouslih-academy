import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Order } from "@/lib/types";
import { orders } from "@/mocks/orders";

/** Délai simulé avant qu'une commande fraîchement créée soit confirmée par « Wave ». */
const AUTO_CONFIRM_AFTER_MS = 6_000;

export async function getOrder(ref: string): Promise<Order | null> {
  if (!USE_MOCKS) {
    try {
      return await apiFetch<Order>(`/api/orders/${ref}`);
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
