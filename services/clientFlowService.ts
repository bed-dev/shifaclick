import { http } from '@/services/http';
import type {
  ConfirmPharmacistResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderStatusResponse,
  PharmacySuggestion,
  SearchSuggestionsResponse,
} from '@/types/clientFlow';

export const DEFAULT_CITY_CENTER = {
  latitude: 35.6969,
  longitude: -0.6331,
  label: 'Oran',
};

export const NEARBY_PHARMACY_PINS = [
  { id: 'ph-01', name: 'Pharmacie Centrale', latitude: 35.6992, longitude: -0.6289, distanceKm: 0.4 },
  { id: 'ph-02', name: 'Pharmacie El Amel', latitude: 35.6945, longitude: -0.638, distanceKm: 0.8 },
  { id: 'ph-03', name: 'Pharmacie Hasnaoui', latitude: 35.701, longitude: -0.642, distanceKm: 1.2 },
  { id: 'ph-04', name: 'Pharmacie Ibn Sina', latitude: 35.693, longitude: -0.626, distanceKm: 1.5 },
  { id: 'ph-05', name: 'Pharmacie du Port', latitude: 35.703, longitude: -0.631, distanceKm: 1.7 },
] as const;

function toPharmacySuggestions(query: string): PharmacySuggestion[] {
  const lower = query.toLowerCase();

  return NEARBY_PHARMACY_PINS.filter((item) => item.name.toLowerCase().includes(lower)).map((item) => ({
    id: item.id,
    name: item.name,
    distanceKm: item.distanceKm,
  }));
}

export const clientFlowService = {
  async searchSuggestions(query: string): Promise<SearchSuggestionsResponse> {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return {
        medicines: [],
        pharmacies: [],
      };
    }

    const { data } = await http.get<{ results: Array<{ id: number; text: string; subtitle: string; dci: string }> }>(
      '/pharmacy/medicine/search/',
      {
        params: { q: trimmed },
      }
    );

    return {
      medicines: data.results ?? [],
      pharmacies: toPharmacySuggestions(trimmed),
    };
  },

  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const medicineName = payload.medicineName?.trim();
    const quantity = payload.quantity?.trim();
    const notes = payload.notes?.trim();

    if (!payload.prescriptionUri) {
      const body: Record<string, string> = {};

      if (medicineName) {
        body.medicine_name = medicineName;
      }

      if (quantity) {
        body.quantity = quantity;
      }

      if (notes) {
        body.notes = notes;
      }

      const { data } = await http.post<CreateOrderResponse>('/client/order/create/', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return data;
    }

    const formData = new FormData();

    if (medicineName) {
      formData.append('medicine_name', medicineName);
    }

    if (quantity) {
      formData.append('quantity', quantity);
    }

    if (notes) {
      formData.append('notes', notes);
    }

    const fileBlobLike = {
      uri: payload.prescriptionUri,
      name: 'prescription.jpg',
      type: 'image/jpeg',
    } as unknown as Blob;

    formData.append('prescription', fileBlobLike);

    const { data } = await http.post<CreateOrderResponse>('/client/order/create/', formData);

    return data;
  },

  async getOrderStatus(orderId: number): Promise<OrderStatusResponse> {
    const { data } = await http.get<OrderStatusResponse>(`/client/order/${orderId}/status/`);
    return data;
  },

  async confirmPharmacist(orderId: number, pharmacistId: number): Promise<ConfirmPharmacistResponse> {
    const body = new URLSearchParams({
      pharmacist_id: String(pharmacistId),
    });

    const { data } = await http.post<ConfirmPharmacistResponse>(`/client/order/${orderId}/confirm/`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  },
};
