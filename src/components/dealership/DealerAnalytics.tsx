import React from 'react';

const DealerAnalytics = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dealer Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Quotes */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Total Quotes</h2>
          <p className="text-xl">1200</p> {/* Placeholder */}
        </div>

        {/* Active Quotes */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Active Quotes</h2>
          <p className="text-xl">350</p> {/* Placeholder */}
        </div>

        {/* Conversion Rate */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Conversion Rate</h2>
          <p className="text-xl">25%</p> {/* Placeholder */}
        </div>

        {/* Total Revenue */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-xl">$500,000</p> {/* Placeholder */}
        </div>

        {/* Average Bid Amount */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Average Bid Amount</h2>
          <p className="text-xl">$2,500</p> {/* Placeholder */}
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Customer Satisfaction</h2>
          <p className="text-xl">4.8/5 Stars</p> {/* Placeholder */}
        </div>
      </div>
    </div>
  );
};

export default DealerAnalytics;
