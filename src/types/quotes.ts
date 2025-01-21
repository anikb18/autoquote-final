export interface CarDetails {
  year: number;
  make: string;
  model: string;
}

export interface DealerProfile {
  dealer_name: string;
}

export interface DealerQuote {
  id: string;
  dealer_id: string;
  is_accepted: boolean;
  dealer_profile?: DealerProfile;
}

export interface Quote {
  id: string;
  car_details: CarDetails;
  dealer_quotes: DealerQuote[];
}