export interface CarDetails {
  year: number;
  make: string;
  model: string;
}

export interface DealerQuote {
  id: string;
  dealer_id: string;
  status?: string;
  response_status?: string;
  response_date?: string;
  response_notes?: string;
  is_accepted: boolean;
  created_at: string;
  dealer_profile?: {
    dealer_name: string;
  };
}

export interface Quote {
  id: string;
  car_details: CarDetails;
  dealer_quotes: DealerQuote[];
  status: string;
  created_at: string;
}