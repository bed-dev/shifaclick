import { http } from '@/services/http';
import type {
  ConfirmPharmacistResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderStatusResponse,
  PharmacySuggestion,
  SearchSuggestionsResponse,
} from '@/types/clientFlow';

const MOCK_CREATE_ORDER_FLAG = process.env.EXPO_PUBLIC_USE_MOCK_CREATE_ORDER;
const FORCE_MOCK_CREATE_ORDER =
  MOCK_CREATE_ORDER_FLAG === undefined
    ? false
    : ['1', 'true', 'yes', 'on'].includes(MOCK_CREATE_ORDER_FLAG.toLowerCase());

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

function buildMockCreateOrderResponse(payload: CreateOrderPayload): CreateOrderResponse {
  const safeMedicine = payload.medicineName?.trim() || 'Requested medication';

  return {
    ok: true,
    order_id: Date.now(),
    message: `Mock order created for ${safeMedicine}.`,
  };
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
    if (FORCE_MOCK_CREATE_ORDER) {
      return buildMockCreateOrderResponse(payload);
    }

    const formData = new FormData();

    if (payload.medicineName?.trim()) {
      formData.append('medicine_name', payload.medicineName.trim());
    }

    if (payload.quantity?.trim()) {
      formData.append('quantity', payload.quantity.trim());
    }

    if (payload.notes?.trim()) {
      formData.append('notes', payload.notes.trim());
    }

    if (payload.prescriptionUri) {
      const fileBlobLike = {
        uri: payload.prescriptionUri,
        name: 'prescription.jpg',
        type: 'image/jpeg',
      } as unknown as Blob;

      formData.append('prescription', fileBlobLike);
    }

    try {
      const { data } = await http.post<CreateOrderResponse>('/client/order/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch {
      return buildMockCreateOrderResponse(payload);
    }
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
