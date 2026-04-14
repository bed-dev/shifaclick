import { http } from '@/services/http';
import type { DistributorStats, SupplyRequest } from '@/types/distributor';

export const distributorService = {
  async getStats(): Promise<DistributorStats> {
    const { data } = await http.get<DistributorStats>('/distributor/stats/');
    return data;
  },

  async getPending(): Promise<SupplyRequest[]> {
    const { data } = await http.get<{ requests: SupplyRequest[] }>('/distributor/supply/pending/');
    return data.requests ?? [];
  },

  async getAccepted(): Promise<SupplyRequest[]> {
    const { data } = await http.get<{ requests: SupplyRequest[] }>('/distributor/supply/accepted/');
    return data.requests ?? [];
  },

  async getHistory(): Promise<SupplyRequest[]> {
    const { data } = await http.get<{ history: SupplyRequest[] }>('/distributor/supply/history/');
    return data.history ?? [];
  },

  async acceptSupply(supplyId: number) {
    const form = new URLSearchParams({ confirm: '1' });
    const { data } = await http.post<{ ok: boolean }>(`/distributor/supply/${supplyId}/accept/`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  },

  async refuseSupply(supplyId: number) {
    const form = new URLSearchParams({ confirm: '1' });
    const { data } = await http.post<{ ok: boolean }>(`/distributor/supply/${supplyId}/refuse/`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  },

  async markDelivered(supplyId: number) {
    const form = new URLSearchParams({ confirm: '1' });
    const { data } = await http.post<{ ok: boolean }>(`/distributor/supply/${supplyId}/deliver/`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  },
};
