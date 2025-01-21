import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const TrustSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Join Leading Dealerships</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Network Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary mb-2">250+</p>
              <p className="text-muted-foreground">Active Dealerships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary mb-2">35%</p>
              <p className="text-muted-foreground">Average Lead Conversion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary mb-2">10K+</p>
              <p className="text-muted-foreground">Monthly Lead Value</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};