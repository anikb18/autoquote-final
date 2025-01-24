export interface CarDetails {
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  options?: string;
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
  dealer_profiles?: {
    dealer_name: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface Quote {
  id: string;
  car_details: CarDetails;
  dealer_quotes: DealerQuote[];
  status: string;
  created_at: string;
}