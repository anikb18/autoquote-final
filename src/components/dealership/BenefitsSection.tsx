import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar, Shield, Users, Calendar } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: ChartBar,
      title: "Private Bidding System",
      description: "No price wars - exclusive access to pre-qualified leads"
    },
    {
      icon: Shield,
      title: "Verified Buyers Only",
      description: "Credit card verified customers ready to purchase"
    },
    {
      icon: Users,
      title: "Automated Management",
      description: "Smart lead distribution with real-time analytics"
    },
    {
      icon: Calendar,
      title: "Dedicated Support",
      description: "24/7 dealer support with satisfaction guarantee"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardHeader>
                <benefit.icon className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};