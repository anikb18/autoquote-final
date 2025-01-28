import React from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import DealerAnalytics from '../components/dealership/DealerAnalytics'; // Corrected import path

const DealerAnalyticsPage = () => {
  return (
    <DashboardLayout>
      <DealerAnalytics />
    </DashboardLayout>
  );
};

export default DealerAnalyticsPage;
