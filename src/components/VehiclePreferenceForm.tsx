import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";

const VehiclePreferenceForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Preferences Submitted",
        description: "We'll connect you with dealers shortly.",
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 text-primary mb-6">
        <Car className="w-6 h-6" />
        <h3 className="text-xl font-semibold">Find Your Perfect Car</h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Make</label>
        <Input placeholder="e.g., Toyota" className="w-full" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Model</label>
        <Input placeholder="e.g., Camry" className="w-full" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Year</label>
        <Input type="number" min="2000" max="2025" placeholder="2024" className="w-full" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Budget Range</label>
        <div className="flex gap-4">
          <Input type="number" placeholder="Min" className="w-1/2" />
          <Input type="number" placeholder="Max" className="w-1/2" />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Get Quotes"}
      </Button>
    </form>
  );
};

export default VehiclePreferenceForm;