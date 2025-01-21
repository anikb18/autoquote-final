import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import SubscriptionPlans from "@/components/SubscriptionPlans";

const SubscriptionManagement = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Subscription Management</h1>
      
      <div className="grid gap-8 md:grid-cols-[400px_1fr]">
        <div>
          <SubscriptionStatus />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionPlans />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionManagement;