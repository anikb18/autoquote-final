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
              <Route path="/new-quote" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NewQuoteForm />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/quote-requests" element={<NewQuoteForm />} />
              
              {/* Dashboard routes wrapped in DashboardLayout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/users" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UserManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/blog" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BlogManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/newsletter" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NewsletterManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/coupons" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CouponManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/my-quotes" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BuyerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/dealers" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BuyerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Settings routes */}
              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings/general" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <GeneralSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings/security" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SecuritySettings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings/notifications" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NotificationSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Dealership routes */}
              <Route path="/dashboard/dealership" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DealershipOverview />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/quotes" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ActiveQuotes />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/dealership/settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DealershipSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute requireSubscription={false}>
                  <DashboardLayout>
                    <SubscriptionManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/support" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Support />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
