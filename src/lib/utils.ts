import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCarDetails(carDetails: any) {
  if (!carDetails) return "N/A";

  try {
    const details =
      typeof carDetails === "string" ? JSON.parse(carDetails) : carDetails;
    return `${details.year} ${details.make} ${details.model}`;
  } catch (error) {
    console.error("Error formatting car details:", error);
    return "Invalid car details";
  }
}
