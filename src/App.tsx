import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DealershipLanding from "./components/DealershipLanding";
import DealerSignup from "./pages/DealerSignup";
import NewQuoteForm from "./components/NewQuoteForm";
import { ThemeProvider } from "@/hooks/use-theme";
import Header from "./components/Header";
import BuyerDashboard from "./components/BuyerDashboard";
import { BlogManagement } from "./components/dashboard/BlogManagement";
import { NewsletterManagement } from "./components/dashboard/NewsletterManagement";
import { UserManagement } from "./components/dashboard/UserManagement";
import AdminSettings from "./components/settings/AdminSettings";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dealership" element={<DealershipLanding />} />
              <Route path="/dealer-signup" element={<DealerSignup />} />

              {/* Admin Dashboard Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                    <DashboardLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/blog" element={<BlogManagement />} />
                        <Route
                          path="/newsletter"
                          element={<NewsletterManagement />}
                        />
                        <Route path="/coupons" element={<CouponManagement />} />
                        <Route
                          path="/page-management"
                          element={<PageManagement />}
                        />
                        <Route path="/settings/*" element={<AdminSettings />} />
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
                        <Route path="/" element={<DealershipOverview />} />
                        <Route path="/quotes" element={<ActiveQuotes />} />
                        <Route
                          path="/settings"
                          element={<DealershipSettings />}
                        />
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
                        <Route path="/" element={<BuyerDashboard />} />
                        <Route path="/my-quotes" element={<BuyerDashboard />} />
                        <Route path="/my-chats" element={<UserChat />} />
                        <Route path="/new-quote" element={<NewQuoteForm />} />
                        <Route
                          path="/settings/*"
                          element={<ProfileSettings />}
                        />
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
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;