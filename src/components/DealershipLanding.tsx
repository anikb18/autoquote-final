import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calendar, ChartBar, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DealershipLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Get Pre-Qualified Leads Without The Bidding War
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Join AutoQuote24's Exclusive Dealer Network
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/dealer-signup")}>
              Join Our Dealer Network
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open("https://calendly.com/your-link", "_blank")}>
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <ChartBar className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Revenue Potential</CardTitle>
                <CardDescription>Private bidding system ensures fair competition with pre-qualified leads</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Exclusive Territory</CardTitle>
                <CardDescription>Guaranteed territory rights with no per-lead fees</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Automated Management</CardTitle>
                <CardDescription>Streamlined lead distribution with real-time analytics</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Dedicated Support</CardTitle>
                <CardDescription>24/7 dealer support with satisfaction guarantee</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Builders */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Leading Dealerships</h2>
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
                <CardTitle>Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary mb-2">35%</p>
                <p className="text-muted-foreground">Average Lead Conversion</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicles Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary mb-2">10K+</p>
                <p className="text-muted-foreground">Through Our Platform</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get Started Today</CardTitle>
              <CardDescription className="text-center">
                Fill out the form below and our team will contact you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dealership Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter dealership name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="City, State"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Sales Volume</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Select volume</option>
                    <option>0-50 vehicles</option>
                    <option>51-100 vehicles</option>
                    <option>101-200 vehicles</option>
                    <option>200+ vehicles</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brands Represented</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Toyota, Honda, Ford"
                  />
                </div>
                <Button className="w-full" size="lg">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DealershipLanding;