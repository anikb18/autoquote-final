import React from 'react';
import { Card } from './ui/card';

const Overview: React.FC = () => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-md border-gray-200/50 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
      <p className="text-gray-600">
        This is the overview section of the dashboard. Here you can find key metrics and insights.
      </p>
    </Card>
  );
};

export default Overview;