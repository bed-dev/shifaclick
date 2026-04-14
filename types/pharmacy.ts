export type DrugStockStatus = 'in' | 'low' | 'out';

export type DrugForm = 'pill' | 'gel' | 'syrup' | 'injection';

export interface DrugAlternative {
  id: string;
  name: string;
  dosage: string;
  stockStatus: DrugStockStatus;
}

export interface InsuranceTier {
  tier: 'A' | 'B' | 'C';
  label: string;
  coveragePercent: number;
  estimatedPriceDzd: number;
}

export interface PharmacyMatch {
  pharmacyId: string;
  pharmacyName: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  etaMinutes: number;
  stockStatus: DrugStockStatus;
  unitsLeft: number;
  expectedRestockDate?: string;
  priceDzd: number;
  isOpen: boolean;
}

export interface DrugSearchResult {
  id: string;
  name: string;
  dosage: string;
  form: DrugForm;
  brand: string;
  stockStatus: DrugStockStatus;
  insuranceTier: 'A' | 'B' | 'C';
  matches: PharmacyMatch[];
}

export interface DrugDetails extends DrugSearchResult {
  description: string;
  alternatives: DrugAlternative[];
  insuranceTiers: InsuranceTier[];
}

export interface SearchFilters {
  maxDistanceKm: number;
  onlyOpenNow: boolean;
  inStockOnly: boolean;
}

export interface DrugRequestPayload {
  drugId: string;
  dosage: string;
  form: DrugForm;
  brandPreference: string;
  quantity: number;
  acceptPartial: boolean;
  prescriptionUri?: string;
}

export interface PatientRequest {
  id: string;
  drugName: string;
  pharmacyName: string;
  status: 'pending' | 'approved' | 'ready' | 'rejected';
  createdAt: string;
  quantity: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'stock_alert' | 'request_approved' | 'restock_ping';
  createdAt: string;
  unread: boolean;
}

export interface HighDemandRequest {
  id: string;
  drugName: string;
  requestedCount: number;
  nearbyPatients: number;
  urgency: 'high' | 'medium';
}

export interface ScannerUpdatePayload {
  barcode: string;
  stockStatus: DrugStockStatus;
  unitsLeft: number;
}

export interface ParsedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  durationDays: number;
}

export interface DoctorNoteScanResult {
  confidence: number;
  physicianName: string;
  issuedAt: string;
  medications: ParsedMedication[];
}

export interface AddMedicationPayload {
  name: string;
  dosage: string;
  form: DrugForm;
  quantity: number;
  notes?: string;
}

export interface DistributorKpi {
  label: string;
  value: string;
}

export interface DistributorOrder {
  id: string;
  pharmacyName: string;
  city: string;
  drugName: string;
  requestedUnits: number;
  priority: 'urgent' | 'normal';
  status: 'pending' | 'allocated' | 'in_transit';
}

export interface DispatchItem {
  id: string;
  destination: string;
  eta: string;
  packageCount: number;
  driverName: string;
  status: 'packing' | 'out_for_delivery' | 'delivered';
}
