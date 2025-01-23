import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change in mobile view
  useEffect(() => {
    if (window.innerWidth < 1024) { // 1024px is the 'lg' breakpoint in Tailwind
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <DashboardSidebar />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div 
              className="fixed inset-0 bg-gray-900/80" 
              onClick={() => setSidebarOpen(false)} 
            />
            <div className="fixed inset-y-0 left-0 w-full max-w-xs">
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                <DashboardSidebar />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-72">
        <Button
          variant="ghost"
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 lg:hidden"
          size="icon"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </Button>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}