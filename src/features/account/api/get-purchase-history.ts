import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Order } from "@/lib/types";
import { orders } from "@/mocks/orders";
import { aminata } from "@/mocks/learner";

export async function getPurchaseHistory(): Promise<Order[]> {
  if (USE_MOCKS) {
    await sleep(400);
    return orders
      .filter((order) => order.userId === aminata.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  return apiFetch<Order[]>("/api/me/orders");
}
