import { CouponManagement } from "./CouponManagement";
import { PricingManagement } from "./PricingManagement";

const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <CouponManagement />
      <PricingManagement />
    </div>
  );
};

export default AdminSettings;