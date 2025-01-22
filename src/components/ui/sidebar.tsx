import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const Sidebar: React.FC<{ onSelect: (section: string) => void; onChangeRole: (role: string) => void }> = ({ onSelect, onChangeRole }) => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 macOS-style">
      <div className="flex flex-col h-full">
        <button onClick={() => onSelect('overview')} className="mb-2 sidebar-button">Overview</button>
        <button onClick={() => onSelect('admin-metrics')} className="mb-2 sidebar-button">Admin Metrics</button>
        <button onClick={() => onSelect('dealer-metrics')} className="mb-2 sidebar-button">Dealer Metrics</button>
        <button onClick={() => onSelect('dealership-comparisons')} className="mb-2 sidebar-button">Dealership Comparisons</button>
        <button onClick={() => onSelect('sales-trend')} className="mb-2 sidebar-button">Sales Trend Chart</button>
        <button onClick={() => onSelect('performance')} className="mb-2 sidebar-button">Performance Chart</button>
        <button onClick={() => onSelect('settings')} className="mb-2 sidebar-button">Settings</button>
        <div className="flex-grow" />
        <div className="mt-auto">
          <Select value={viewMode} onValueChange={(value: ViewMode) => onChangeRole(value)}>
            <SelectTrigger className="w-[140px] text-sm h-8">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin" className="text-sm">Admin View</SelectItem>
              <SelectItem value="dealer" className="text-sm">Dealer View</SelectItem>
              <SelectItem value="buyer" className="text-sm">Buyer View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
