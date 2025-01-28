import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import { ViewModeProvider } from "@/components/dashboard/ViewModeProvider";
import { useUserRole } from "@/hooks/use-user-role";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DealershipLanding from "./components/DealershipLanding";
import DealerSignup from "./pages/DealerSignup";
import NewQuoteForm from "./components/NewQuoteForm";
import AdminAnalytics from "./pages/admin/Analytics";
import DealerAnalyticsPage from "./pages/DealerAnalyticsPage";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import BuyerDashboard from "./components/BuyerDashboard";
import { BlogManagement } from "./components/dashboard/BlogManagement";
import { NewsletterManagement } from "./components/dashboard/NewsletterManagement";
import { UserManagement } from "./components/dashboard/UserManagement";
import AdminSettings from "./components/settings/AdminSettings";
import { DealershipOverview } from "./components/dealership/DealershipOverview";
import { ActiveQuotes } from "./components/dealership/ActiveQuotes";
import { DealershipSettings } from "./components/dealership/DealershipSettings";
import Support from "./pages/Support";
import { CouponManagement } from "./components/settings/CouponManagement";
import { GeneralSettings } from "./components/settings/GeneralSettings";
import { SecuritySettings } from "./components/settings/SecuritySettings";
import { NotificationSettings } from "./components/settings/NotificationSettings";
import { ProfileSettings } from "./components/settings/ProfileSettings";
import PageManagement from "./components/dashboard/PageManagement";
import DealerChat from "./pages/chat/DealerChat";
import UserChat from "./pages/chat/UserChat";
import Header from "./components/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const RoleBasedRedirect = () => {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  switch (role) {
    case "admin":
    case "super_admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "dealer":
      return <Navigate to="/dealer/dashboard" replace />;
    default:
      return <Navigate to="/dashboard/my-quotes" replace />;
  }
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="autoquote-theme">
      <QueryClientProvider client={queryClient}>
        <ViewModeProvider>
          <Router>
            <main className="min-h-screen dark:bg-gray-900">
              <Routes>
                <Route path="/" element={<><Header /><Index /></>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dealership" element={<DealershipLanding />} />
                <Route path="/dealer-signup" element={<DealerSignup />} />
                <Route path="/new-quote" element={<NewQuoteForm />} />

                {/* Role-based redirect */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleBasedRedirect />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Dashboard Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                      <DashboardLayout>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/analytics" element={<AdminAnalytics />} />
                          <Route path="/users" element={<UserManagement />} />
                          <Route path="/blog" element={<BlogManagement />} />
                          <Route path="/newsletter" element={<NewsletterManagement />} />
                          <Route path="/coupons" element={<CouponManagement />} />
                          <Route path="/page-management" element={<PageManagement />} />
                          <Route path="/settings/*" element={<AdminSettings />} />
                          
                          {/* Admin as Dealer Routes - Allow admin to access dealer routes */}
                          <Route path="/dealer/*" element={
                            <Routes>
                              <Route path="/dashboard" element={<DealershipOverview />} />
                              <Route path="/quotes" element={<ActiveQuotes />} />
                              <Route path="/analytics" element={<DealerAnalyticsPage />} />
                              <Route path="/settings" element={<DealershipSettings />} />
                              <Route path="/chat" element={<DealerChat />} />
                            </Routes>
                          } />
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Dealer Dashboard Routes */}
                <Route
                  path="/dealer/*"
                  element={
                    <ProtectedRoute allowedRoles={["dealer"]}>
                      <DashboardLayout>
                        <Routes>
                          <Route path="/dashboard" element={<DealershipOverview />} />
                          <Route path="/quotes" element={<ActiveQuotes />} />
                          <Route path="/analytics" element={<DealerAnalyticsPage />} />
                          <Route path="/settings" element={<DealershipSettings />} />
                          <Route path="/chat" element={<DealerChat />} />
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* User Dashboard Routes */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Routes>
                          <Route path="/my-quotes" element={<BuyerDashboard />} />
                          <Route path="/chat/:quoteId" element={<UserChat />} />
                          <Route path="/settings/*" element={<ProfileSettings />} />
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute requireSubscription={false}>
                      <DashboardLayout>
                        <SubscriptionManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/support"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Support />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </Router>
        </ViewModeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;