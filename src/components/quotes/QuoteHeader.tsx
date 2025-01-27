import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CarDetails } from "@/types/quotes";

interface QuoteHeaderProps {
  carDetails: CarDetails;
}

export const QuoteHeader = ({ carDetails }: QuoteHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>
        {carDetails.year} {carDetails.make} {carDetails.model}
      </CardTitle>
    </CardHeader>
  );
};
