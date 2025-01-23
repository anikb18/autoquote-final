import { DealershipComparison } from "@/components/dashboard/DealershipComparison";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DealerAnalytics() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dealer Analytics</h2>
        <p className="text-muted-foreground mt-2">
          Overview of dealership performance and comparisons
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dealership Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <DealershipComparison />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}