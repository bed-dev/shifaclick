export interface MedicineSuggestion {
  id: number;
  text: string;
  subtitle: string;
  dci: string;
}

export interface PharmacySuggestion {
  id: string;
  name: string;
  distanceKm: number;
}

export interface SearchSuggestionsResponse {
  medicines: MedicineSuggestion[];
  pharmacies: PharmacySuggestion[];
}

export interface CreateOrderPayload {
  medicineName?: string;
  quantity?: string;
  notes?: string;
  prescriptionUri?: string;
}

export interface CreateOrderResponse {
  ok: boolean;
  order_id: number;
  message?: string;
}

export interface AcceptedPharmacist {
  id: number;
  name: string;
  pharmacy: string;
  address: string;
  phone: string;
  lat: number | null;
  lng: number | null;
}

export interface OrderStatusResponse {
  order_id: number;
  status: 'pending' | 'responded' | 'confirmed' | 'cancelled';
  accepted_count: number;
  accepted: AcceptedPharmacist[];
  chosen?: {
    id: number;
    name: string;
    pharmacy: string;
    address: string;
    phone: string;
  };
}

export interface ConfirmPharmacistResponse {
  ok: boolean;
  pharmacy: string;
  address: string;
  phone: string;
}

export interface TrackedOrder {
  orderId: number;
  medicineName: string;
  quantity?: string;
  createdAt: string;
}
