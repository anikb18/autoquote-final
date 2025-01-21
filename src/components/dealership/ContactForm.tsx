import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const ContactForm = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Secure Your Territory Now</CardTitle>
            <CardDescription className="text-center">
              Limited pre-launch pricing available - Join before your market is locked
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
                Get Exclusive Access
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};