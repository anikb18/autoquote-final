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
import BlogManagement from "./components/dashboard/BlogManagement";
import NewsletterManagement from "./components/dashboard/NewsletterManagement";
import UserManagement from "./components/dashboard/UserManagement";

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
              <Route path="/new-quote" element={<NewQuoteForm />} />
              <Route path="/quote-requests" element={<NewQuoteForm />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/users"
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/blog"
                element={
                  <ProtectedRoute>
                    <BlogManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/newsletter"
                element={
                  <ProtectedRoute>
                    <NewsletterManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/my-quotes"
                element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/dealers"
                element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute requireSubscription={false}>
                    <SubscriptionManagement />
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