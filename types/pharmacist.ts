export interface PendingOrder {
  id: number;
  client_name: string;
  client_phone: string;
  medicine_name: string;
  quantity: string;
  notes: string;
  has_prescription: boolean;
  prescription_url: string | null;
  created_at: string;
  status: string;
}

export interface AcceptedOrder {
  id: number;
  client_name: string;
  medicine_name: string;
  order_status: string;
  is_chosen: boolean;
  responded_at: string;
}
