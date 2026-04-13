export type UserRole = 'client' | 'pharmacist' | 'distributor';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  verified: boolean;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export interface PharmacyAvailability {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  rating: number;
  openUntil: string;
  stockStatus: 'all' | 'partial' | 'none';
  priceDzd: number;
}

export interface FeedItem {
  id: string;
  medicineName: string;
  dosage: string;
  category: string;
  manufacturer: string;
  description: string;
  tags: string[];
  imageTint: string;
  availablePharmacies: number;
  minPriceDzd: number;
  pharmacies: PharmacyAvailability[];
}

export interface ActivityItem {
  id: string;
  medicineName: string;
  pharmacyName: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'ready';
  quantity: number;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}
