import { delay } from '@/lib/delay';
import type {
  AddMedicationPayload,
  AppNotification,
  DispatchItem,
  DistributorKpi,
  DistributorOrder,
  DoctorNoteScanResult,
  DrugDetails,
  DrugRequestPayload,
  DrugSearchResult,
  HighDemandRequest,
  ParsedMedication,
  PatientRequest,
  ScannerUpdatePayload,
  SearchFilters,
} from '@/types/pharmacy';

const DEFAULT_FILTERS: SearchFilters = {
  maxDistanceKm: 5,
  onlyOpenNow: false,
  inStockOnly: false,
};

const DRUGS: DrugDetails[] = [
  {
    id: 'drug-001',
    name: 'Doliprane',
    dosage: '1000mg',
    form: 'pill',
    brand: 'Sanofi',
    description: 'Paracetamol analgesic for fever and mild-to-moderate pain.',
    stockStatus: 'in',
    insuranceTier: 'A',
    matches: [
      {
        pharmacyId: 'ph-001',
        pharmacyName: 'Pharmacie Centrale',
        latitude: 35.6981,
        longitude: -0.6352,
        distanceKm: 0.6,
        etaMinutes: 5,
        stockStatus: 'in',
        unitsLeft: 38,
        priceDzd: 270,
        isOpen: true,
      },
      {
        pharmacyId: 'ph-002',
        pharmacyName: 'Pharmacie El Wiam',
        latitude: 35.6964,
        longitude: -0.623,
        distanceKm: 1.4,
        etaMinutes: 9,
        stockStatus: 'low',
        unitsLeft: 4,
        expectedRestockDate: '2026-04-16',
        priceDzd: 290,
        isOpen: true,
      },
    ],
    alternatives: [
      { id: 'alt-001', name: 'Efferalgan', dosage: '1000mg', stockStatus: 'in' },
      { id: 'alt-002', name: 'Paracetamol Biogaran', dosage: '1000mg', stockStatus: 'low' },
    ],
    insuranceTiers: [
      { tier: 'A', label: 'National Insurance', coveragePercent: 80, estimatedPriceDzd: 54 },
      { tier: 'B', label: 'Mutual Partner', coveragePercent: 60, estimatedPriceDzd: 108 },
      { tier: 'C', label: 'Out of Network', coveragePercent: 0, estimatedPriceDzd: 270 },
    ],
  },
  {
    id: 'drug-002',
    name: 'Augmentin',
    dosage: '875mg/125mg',
    form: 'pill',
    brand: 'GSK',
    description: 'Prescription antibiotic combining amoxicillin and clavulanic acid.',
    stockStatus: 'out',
    insuranceTier: 'B',
    matches: [
      {
        pharmacyId: 'ph-003',
        pharmacyName: 'Pharmacie Ibn Sina',
        latitude: 35.6917,
        longitude: -0.6271,
        distanceKm: 1.8,
        etaMinutes: 11,
        stockStatus: 'out',
        unitsLeft: 0,
        expectedRestockDate: '2026-04-18',
        priceDzd: 760,
        isOpen: true,
      },
      {
        pharmacyId: 'ph-004',
        pharmacyName: 'Pharmacie Ennour',
        latitude: 35.7024,
        longitude: -0.6153,
        distanceKm: 2.7,
        etaMinutes: 17,
        stockStatus: 'low',
        unitsLeft: 2,
        expectedRestockDate: '2026-04-15',
        priceDzd: 790,
        isOpen: false,
      },
    ],
    alternatives: [
      { id: 'alt-003', name: 'Amoxicillin', dosage: '1g', stockStatus: 'in' },
      { id: 'alt-004', name: 'Clamoxyl', dosage: '500mg', stockStatus: 'low' },
    ],
    insuranceTiers: [
      { tier: 'A', label: 'National Insurance', coveragePercent: 70, estimatedPriceDzd: 228 },
      { tier: 'B', label: 'Mutual Partner', coveragePercent: 50, estimatedPriceDzd: 380 },
      { tier: 'C', label: 'Out of Network', coveragePercent: 0, estimatedPriceDzd: 760 },
    ],
  },
  {
    id: 'drug-003',
    name: 'Voltarene Gel',
    dosage: '1%',
    form: 'gel',
    brand: 'Novartis',
    description: 'Topical anti-inflammatory gel for joint and muscle pain relief.',
    stockStatus: 'low',
    insuranceTier: 'A',
    matches: [
      {
        pharmacyId: 'ph-005',
        pharmacyName: 'Pharmacie El Hikma',
        latitude: 35.6883,
        longitude: -0.6326,
        distanceKm: 1.2,
        etaMinutes: 7,
        stockStatus: 'low',
        unitsLeft: 5,
        expectedRestockDate: '2026-04-14',
        priceDzd: 520,
        isOpen: true,
      },
    ],
    alternatives: [{ id: 'alt-005', name: 'Diclofenac Gel', dosage: '1%', stockStatus: 'in' }],
    insuranceTiers: [
      { tier: 'A', label: 'National Insurance', coveragePercent: 75, estimatedPriceDzd: 130 },
      { tier: 'B', label: 'Mutual Partner', coveragePercent: 50, estimatedPriceDzd: 260 },
      { tier: 'C', label: 'Out of Network', coveragePercent: 0, estimatedPriceDzd: 520 },
    ],
  },
];

let REQUESTS: PatientRequest[] = [
  {
    id: 'req-001',
    drugName: 'Doliprane 1000mg',
    pharmacyName: 'Pharmacie Centrale',
    status: 'ready',
    createdAt: '2026-04-13 09:12',
    quantity: 1,
  },
  {
    id: 'req-002',
    drugName: 'Augmentin 875mg/125mg',
    pharmacyName: 'Pharmacie Ibn Sina',
    status: 'approved',
    createdAt: '2026-04-12 18:40',
    quantity: 1,
  },
];

const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'not-001',
    title: 'Restock Alert',
    body: 'Doliprane 1000mg is now in stock at Pharmacie Centrale.',
    type: 'restock_ping',
    createdAt: '2026-04-13 09:18',
    unread: true,
  },
  {
    id: 'not-002',
    title: 'Request Approved',
    body: 'Your Augmentin request was approved. Pickup available in 30 minutes.',
    type: 'request_approved',
    createdAt: '2026-04-12 19:05',
    unread: true,
  },
  {
    id: 'not-003',
    title: 'Low Stock Warning',
    body: 'Voltarene Gel has dropped to low stock in nearby pharmacies.',
    type: 'stock_alert',
    createdAt: '2026-04-12 14:22',
    unread: false,
  },
];

const HIGH_DEMAND: HighDemandRequest[] = [
  { id: 'hd-001', drugName: 'Insulin Glargine', requestedCount: 17, nearbyPatients: 29, urgency: 'high' },
  { id: 'hd-002', drugName: 'Augmentin 875mg', requestedCount: 13, nearbyPatients: 22, urgency: 'high' },
  { id: 'hd-003', drugName: 'Ventolin Inhaler', requestedCount: 8, nearbyPatients: 12, urgency: 'medium' },
];

const DISTRIBUTOR_KPIS: DistributorKpi[] = [
  { label: 'Open Orders', value: '46' },
  { label: 'Today Dispatches', value: '12' },
  { label: 'Fill Rate', value: '93%' },
  { label: 'Cold-chain Alerts', value: '1' },
];

const DISTRIBUTOR_ORDERS: DistributorOrder[] = [
  {
    id: 'ord-001',
    pharmacyName: 'Pharmacie Centrale',
    city: 'Oran',
    drugName: 'Insulin Glargine',
    requestedUnits: 24,
    priority: 'urgent',
    status: 'pending',
  },
  {
    id: 'ord-002',
    pharmacyName: 'Pharmacie Ibn Sina',
    city: 'Oran',
    drugName: 'Augmentin 875mg',
    requestedUnits: 40,
    priority: 'urgent',
    status: 'allocated',
  },
  {
    id: 'ord-003',
    pharmacyName: 'Pharmacie El Hikma',
    city: 'Mostaganem',
    drugName: 'Ventolin Inhaler',
    requestedUnits: 30,
    priority: 'normal',
    status: 'in_transit',
  },
];

const DISPATCH_ITEMS: DispatchItem[] = [
  {
    id: 'dsp-001',
    destination: 'Oran Central District',
    eta: '10:45',
    packageCount: 7,
    driverName: 'K. Mansouri',
    status: 'packing',
  },
  {
    id: 'dsp-002',
    destination: 'Es Senia',
    eta: '11:25',
    packageCount: 4,
    driverName: 'A. Rahmani',
    status: 'out_for_delivery',
  },
  {
    id: 'dsp-003',
    destination: 'Mostaganem',
    eta: 'Delivered 09:05',
    packageCount: 6,
    driverName: 'S. Bouzid',
    status: 'delivered',
  },
];

const MOCK_PARSED_MEDICATIONS: ParsedMedication[] = [
  { id: 'pm-001', name: 'Doliprane', dosage: '1000mg', frequency: 'Every 8h', durationDays: 3 },
  { id: 'pm-002', name: 'Augmentin', dosage: '875mg/125mg', frequency: 'Every 12h', durationDays: 7 },
];

function applyFilters(results: DrugSearchResult[], filters: SearchFilters): DrugSearchResult[] {
  return results
    .map((result) => ({
      ...result,
      matches: result.matches.filter((match) => {
        if (match.distanceKm > filters.maxDistanceKm) {
          return false;
        }

        if (filters.onlyOpenNow && !match.isOpen) {
          return false;
        }

        if (filters.inStockOnly && match.stockStatus === 'out') {
          return false;
        }

        return true;
      }),
    }))
    .filter((result) => result.matches.length > 0);
}

export const pharmacyService = {
  async searchDrugs(query: string, filters: Partial<SearchFilters> = {}): Promise<DrugSearchResult[]> {
    await delay(450);

    const merged = { ...DEFAULT_FILTERS, ...filters };
    const lower = query.trim().toLowerCase();

    const baseResults = DRUGS.filter((drug) => {
      if (!lower) {
        return true;
      }

      return (
        drug.name.toLowerCase().includes(lower) ||
        drug.brand.toLowerCase().includes(lower) ||
        drug.dosage.toLowerCase().includes(lower)
      );
    }).map(({ description, alternatives, insuranceTiers, ...summary }) => summary);

    return applyFilters(baseResults, merged);
  },

  async getDrugDetails(drugId: string): Promise<DrugDetails> {
    await delay(350);

    const drug = DRUGS.find((entry) => entry.id === drugId);

    if (!drug) {
      throw new Error('Drug not found.');
    }

    return drug;
  },

  async submitDrugRequest(payload: DrugRequestPayload): Promise<{ requestId: string }> {
    await delay(700);

    const drug = DRUGS.find((item) => item.id === payload.drugId);

    if (!drug) {
      throw new Error('Unable to create request: drug not found.');
    }

    const preferredMatch = drug.matches[0];
    const requestId = `req-${Date.now()}`;

    REQUESTS = [
      {
        id: requestId,
        drugName: `${drug.name} ${payload.dosage}`,
        pharmacyName: preferredMatch?.pharmacyName ?? 'Nearby Pharmacy',
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        quantity: payload.quantity,
      },
      ...REQUESTS,
    ];

    return { requestId };
  },

  async getPatientRequests(): Promise<PatientRequest[]> {
    await delay(300);
    return REQUESTS;
  },

  async getNotifications(): Promise<AppNotification[]> {
    await delay(250);
    return NOTIFICATIONS;
  },

  async getHighDemandRequests(): Promise<HighDemandRequest[]> {
    await delay(300);
    return HIGH_DEMAND;
  },

  async updateStockFromScanner(payload: ScannerUpdatePayload): Promise<{ ok: true; updatedAt: string }> {
    await delay(320);

    if (!payload.barcode.trim()) {
      throw new Error('Barcode is required.');
    }

    return {
      ok: true,
      updatedAt: new Date().toISOString(),
    };
  },

  async scanDoctorNote(imageUri?: string): Promise<DoctorNoteScanResult> {
    await delay(900);

    if (!imageUri) {
      throw new Error('Doctor note image is required for scanning.');
    }

    return {
      confidence: 0.93,
      physicianName: 'Dr. K. Bensalem',
      issuedAt: '2026-04-13',
      medications: MOCK_PARSED_MEDICATIONS,
    };
  },

  async addMedication(payload: AddMedicationPayload): Promise<{ medicationId: string }> {
    await delay(450);

    if (!payload.name.trim() || !payload.dosage.trim() || payload.quantity < 1) {
      throw new Error('Medication name, dosage, and quantity are required.');
    }

    return {
      medicationId: `med-${Date.now()}`,
    };
  },

  async getDistributorKpis(): Promise<DistributorKpi[]> {
    await delay(300);
    return DISTRIBUTOR_KPIS;
  },

  async getDistributorOrders(): Promise<DistributorOrder[]> {
    await delay(350);
    return DISTRIBUTOR_ORDERS;
  },

  async getDispatchItems(): Promise<DispatchItem[]> {
    await delay(350);
    return DISPATCH_ITEMS;
  },

};
