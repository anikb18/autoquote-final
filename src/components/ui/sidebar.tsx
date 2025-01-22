import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import md5 from 'md5';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"; // Correct import for Select component

const Sidebar = ({ user, onSelect, onChangeRole, viewMode }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch Gravatar URL
  useEffect(() => {
    if (user?.email) {
      const hash = md5(user.email.toLowerCase().trim());
      const url = `https://www.gravatar.com/avatar/${hash}?d=404`;
      setAvatarUrl(url);
    }
  }, [user?.email]);

  const isAdmin = user?.user_metadata?.role === 'admin';
  const isDealer = user?.user_metadata?.role === 'dealer';
  const isUser = user?.user_metadata?.role === 'user';

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 macOS-style">
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center px-6">
          <img className="h-8 w-auto" src="/logo-dark.svg" alt="AutoQuote24" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {isAdmin && (
                  <> 
                    <li>
                      <Link to="/admin/dashboard" className="sidebar-button" onClick={() => onSelect('admin-dashboard')}>Dashboard Overview</Link>
                    </li>
                    <li>
                      <Link to="/admin/users" className="sidebar-button" onClick={() => onSelect('admin-users')}>User Management</Link>
                    </li>
                    <li>
                      <Link to="/admin/dealers" className="sidebar-button" onClick={() => onSelect('admin-dealers')}>Dealer Management</Link>
                    </li>
                    <li>
                      <Link to="/admin/reports" className="sidebar-button" onClick={() => onSelect('admin-reports')}>Reports</Link>
                    </li>
                    <li>
                      <Link to="/admin/settings" className="sidebar-button" onClick={() => onSelect('admin-settings')}>Settings</Link>
                    </li>
                    <li>
                      <Link to="/logout" className="sidebar-button" onClick={() => onSelect('logout')}>Logout</Link>
                    </li>
                  </>
                )}
                {isDealer && (
                  <> 
                    <li>
                      <Link to="/dealer/dashboard" className="sidebar-button" onClick={() => onSelect('dealer-dashboard')}>Dashboard Overview</Link>
                    </li>
                    <li>
                      <Link to="/dealer/quotes" className="sidebar-button" onClick={() => onSelect('dealer-quotes')}>My Quotes</Link>
                    </li>
                    <li>
                      <Link to="/dealer/listings" className="sidebar-button" onClick={() => onSelect('dealer-listings')}>Manage Listings</Link>
                    </li>
                    <li>
                      <Link to="/dealer/communication" className="sidebar-button" onClick={() => onSelect('dealer-communication')}>Communication Hub</Link>
                    </li>
                    <li>
                      <Link to="/dealer/analytics" className="sidebar-button" onClick={() => onSelect('dealer-analytics')}>Performance Analytics</Link>
                    </li>
                    <li>
                      <Link to="/logout" className="sidebar-button" onClick={() => onSelect('logout')}>Logout</Link>
                    </li>
                  </>
                )}
                {isUser && (
                  <> 
                    <li>
                      <Link to="/user/dashboard" className="sidebar-button" onClick={() => onSelect('user-dashboard')}>Dashboard Overview</Link>
                    </li>
                    <li>
                      <Link to="/user/quotes" className="sidebar-button" onClick={() => onSelect('user-quotes')}>My Quotes</Link>
                    </li>
                    <li>
                      <Link to="/user/communication" className="sidebar-button" onClick={() => onSelect('user-communication')}>Communication Hub</Link>
                    </li>
                    <li>
                      <Link to="/logout" className="sidebar-button" onClick={() => onSelect('logout')}>Logout</Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/overview" className="sidebar-button" onClick={() => onSelect('overview')}>Overview</Link>
                </li>
                <li>
                  <Link to="/admin-metrics" className="sidebar-button" onClick={() => onSelect('admin-metrics')}>Admin Metrics</Link>
                </li>
                <li>
                  <Link to="/dealer-metrics" className="sidebar-button" onClick={() => onSelect('dealer-metrics')}>Dealer Metrics</Link>
                </li>
                <li>
                  <Link to="/dealership-comparisons" className="sidebar-button" onClick={() => onSelect('dealership-comparisons')}>Dealership Comparisons</Link>
                </li>
                <li>
                  <Link to="/sales-trend" className="sidebar-button" onClick={() => onSelect('sales-trend')}>Sales Trend Chart</Link>
                </li>
                <li>
                  <Link to="/performance" className="sidebar-button" onClick={() => onSelect('performance')}>Performance Chart</Link>
                </li>
                <li>
                  <Link to="/settings" className="sidebar-button" onClick={() => onSelect('settings')}>Account Management</Link>
                </li>
              </ul>
            </li>
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 px-6 py-4 text-sm font-semibold leading-6 text-white">
                {avatarUrl && (
                  <div className="avatar-container">
                    <img src={avatarUrl} alt="User Avatar" className="avatar h-8 w-8 rounded-full bg-gray-50" />
                  </div>
                )}
                <span aria-hidden="true">Admin Email</span>
                <Select value={viewMode} onValueChange={(value: string) => onChangeRole(value)}>
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
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
