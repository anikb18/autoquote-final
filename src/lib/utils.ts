import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CarDetails {
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
}

export const formatCarDetails = (details: any): string => {
  if (!details) return 'No details available';
  
  try {
    const carDetails = typeof details === 'string' ? JSON.parse(details) : details;
    const { make, model, year, trim } = carDetails as CarDetails;
    
    const parts = [];
    if (year) parts.push(year);
    if (make) parts.push(make);
    if (model) parts.push(model);
    if (trim) parts.push(trim);
    
    return parts.join(' ') || 'No details available';
  } catch (error) {
    console.error('Error formatting car details:', error);
    return 'Invalid car details';
  }
}