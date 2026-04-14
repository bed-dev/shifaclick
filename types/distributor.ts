export interface SupplyRequestItem {
  name: string;
  dci: string;
  qty: number;
  unit: string;
}

export interface SupplyRequest {
  id: number;
  pharmacist: string;
  pharmacy_name: string;
  pharmacy_addr: string;
  phone: string;
  priority: 'normal' | 'urgent';
  status: 'pending' | 'accepted' | 'refused' | 'delivered';
  notes: string;
  items: SupplyRequestItem[];
  item_count: number;
  created_at: string;
  responded_at: string | null;
}

export interface DistributorStats {
  total: number;
  accepted: number;
  delivered: number;
  refused: number;
  pending: number;
}
