import type { ActivityItem, FeedItem, UserProfile } from '@/src/types/models';

const feedItems: FeedItem[] = [
  {
    id: 'med-001',
    medicineName: 'Doliprane',
    dosage: '1000mg',
    category: 'Pain Relief',
    manufacturer: 'Sanofi',
    description:
      'Fast-acting paracetamol used for fever and mild to moderate pain. Commonly available in nearby partner pharmacies.',
    tags: ['Fever', 'Headache', 'OTC'],
    imageTint: '#3CA4AC',
    availablePharmacies: 12,
    minPriceDzd: 270,
    pharmacies: [
      {
        id: 'pha-001',
        name: 'Pharmacie Centrale',
        distanceKm: 0.4,
        etaMinutes: 5,
        rating: 4.8,
        openUntil: '22:00',
        stockStatus: 'all',
        priceDzd: 270,
      },
      {
        id: 'pha-002',
        name: 'Pharmacie El Amel',
        distanceKm: 0.8,
        etaMinutes: 10,
        rating: 4.5,
        openUntil: '24h',
        stockStatus: 'all',
        priceDzd: 290,
      },
      {
        id: 'pha-003',
        name: 'Pharmacie Hasnaoui',
        distanceKm: 1.2,
        etaMinutes: 14,
        rating: 4.6,
        openUntil: '21:00',
        stockStatus: 'partial',
        priceDzd: 300,
      },
    ],
  },
  {
    id: 'med-002',
    medicineName: 'Augmentin',
    dosage: '875mg/125mg',
    category: 'Antibiotic',
    manufacturer: 'GSK',
    description:
      'Prescription antibiotic combining amoxicillin and clavulanic acid. Verify dosage with your physician before use.',
    tags: ['Prescription', 'Infection'],
    imageTint: '#2D3E50',
    availablePharmacies: 6,
    minPriceDzd: 760,
    pharmacies: [
      {
        id: 'pha-004',
        name: 'Pharmacie Ibn Sina',
        distanceKm: 1.1,
        etaMinutes: 13,
        rating: 4.7,
        openUntil: '23:00',
        stockStatus: 'all',
        priceDzd: 760,
      },
      {
        id: 'pha-005',
        name: 'Pharmacie du Port',
        distanceKm: 1.7,
        etaMinutes: 19,
        rating: 4.4,
        openUntil: '21:30',
        stockStatus: 'partial',
        priceDzd: 790,
      },
    ],
  },
  {
    id: 'med-003',
    medicineName: 'Voltarene',
    dosage: '75mg',
    category: 'Anti-inflammatory',
    manufacturer: 'Novartis',
    description:
      'Diclofenac-based anti-inflammatory commonly prescribed for short-term pain management and muscle inflammation.',
    tags: ['Joint Pain', 'Prescription'],
    imageTint: '#F97316',
    availablePharmacies: 4,
    minPriceDzd: 510,
    pharmacies: [
      {
        id: 'pha-006',
        name: 'Pharmacie Al Waha',
        distanceKm: 0.9,
        etaMinutes: 11,
        rating: 4.3,
        openUntil: '22:30',
        stockStatus: 'all',
        priceDzd: 510,
      },
      {
        id: 'pha-007',
        name: 'Pharmacie Ennour',
        distanceKm: 2.2,
        etaMinutes: 24,
        rating: 4.1,
        openUntil: '20:30',
        stockStatus: 'partial',
        priceDzd: 545,
      },
    ],
  },
];

const activityItems: ActivityItem[] = [
  {
    id: 'act-001',
    medicineName: 'Doliprane 1000mg',
    pharmacyName: 'Pharmacie Centrale',
    createdAt: '2 min ago',
    status: 'ready',
    quantity: 1,
  },
  {
    id: 'act-002',
    medicineName: 'Augmentin 875mg',
    pharmacyName: 'Pharmacie Ibn Sina',
    createdAt: '35 min ago',
    status: 'accepted',
    quantity: 1,
  },
  {
    id: 'act-003',
    medicineName: 'Voltarene 75mg',
    pharmacyName: 'Pharmacie El Amel',
    createdAt: '1 day ago',
    status: 'declined',
    quantity: 2,
  },
  {
    id: 'act-004',
    medicineName: 'Efferalgan 500mg',
    pharmacyName: 'Pharmacie Hasnaoui',
    createdAt: '2 days ago',
    status: 'pending',
    quantity: 3,
  },
];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

let currentUser: UserProfile = {
  id: 'usr-001',
  firstName: 'Yacine',
  lastName: 'Benali',
  email: 'yacine@example.com',
  phone: '+213 6 12 34 56 78',
  city: 'Oran',
  role: 'client',
  verified: true,
};

export const mockStore = {
  getFeedItems: () => clone(feedItems),
  getFeedItemById: (id: string) => clone(feedItems.find((item) => item.id === id) ?? null),
  getActivityItems: () => clone(activityItems),
  getCurrentUser: () => clone(currentUser),
  setCurrentUser: (profile: UserProfile) => {
    currentUser = clone(profile);
  },
};
