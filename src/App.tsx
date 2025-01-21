import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import BlogPost from "./components/BlogPost";
import BlogList from "./components/BlogList";
import QuoteDetails from "./components/QuoteDetails";
import FinancialTools from "./components/financial/FinancialTools";
import PaymentCalculator from "./components/financial/PaymentCalculator";
import LoanPreApproval from "./components/financial/LoanPreApproval";
import InsuranceQuote from "./components/financial/InsuranceQuote";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tools" element={<FinancialTools />} />
              <Route path="/tools/payment-calculator" element={<PaymentCalculator />} />
              <Route path="/tools/loan-pre-approval" element={<LoanPreApproval />} />
              <Route path="/tools/insurance-quote" element={<InsuranceQuote />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <SubscriptionManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <ProtectedRoute>
                    <BlogList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/:id"
                element={
                  <ProtectedRoute>
                    <BlogPost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quotes/:id"
                element={
                  <ProtectedRoute>
                    <QuoteDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;