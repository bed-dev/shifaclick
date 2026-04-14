import { http } from '@/services/http';
import type { AcceptedOrder, PendingOrder } from '@/types/pharmacist';

export const pharmacistService = {
  async getPendingOrders(): Promise<PendingOrder[]> {
    const { data } = await http.get<{ orders: PendingOrder[] }>('/pharmacy/orders/pending/');
    return data.orders ?? [];
  },

  async getAcceptedOrders(): Promise<AcceptedOrder[]> {
    const { data } = await http.get<{ orders: AcceptedOrder[] }>('/pharmacy/orders/accepted/');
    return data.orders ?? [];
  },

  async acceptOrder(orderId: number) {
    const form = new URLSearchParams({ confirm: '1' });
    const { data } = await http.post<{ ok: boolean }>(`/pharmacy/orders/${orderId}/accept/`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  },

  async refuseOrder(orderId: number) {
    const form = new URLSearchParams({ confirm: '1' });
    const { data } = await http.post<{ ok: boolean }>(`/pharmacy/orders/${orderId}/refuse/`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  },
};
