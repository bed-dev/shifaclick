import { secureGetItemAsync, secureSetItemAsync } from '@/services/secureStoreCompat';

import type { TrackedOrder } from '@/types/clientFlow';

const ORDERS_KEY = 'tracked_client_orders';

export async function getTrackedOrders(): Promise<TrackedOrder[]> {
  const raw = await secureGetItemAsync(ORDERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as TrackedOrder[];
    return parsed;
  } catch {
    return [];
  }
}

export async function addTrackedOrder(next: TrackedOrder) {
  const current = await getTrackedOrders();
  const updated = [next, ...current.filter((item) => item.orderId !== next.orderId)].slice(0, 25);
  await secureSetItemAsync(ORDERS_KEY, JSON.stringify(updated));
}
