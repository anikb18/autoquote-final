import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import DealerAnalytics from "@/pages/dashboard/analytics/dealer";
import DealerDashboard from "@/components/DealerDashboard";
import SettingsLayout from "@/components/settings/SettingsLayout";
import SupportRequest from "@/components/support/SupportRequest";
import SupportTicketList from "@/components/support/SupportTicketList";
import Testimonials from "@/components/Testimonials";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DealerDashboard />} />
            <Route path="/dashboard" element={<DealerDashboard />} />
            <Route path="/settings/*" element={<SettingsLayout />} />
            <Route path="/support" element={<SupportRequest />} />
            <Route path="/support/tickets" element={<SupportTicketList userOnly={true} />} />
            <Route path="/dashboard/analytics/dealer" element={<DealerAnalytics />} />
            <Route path="/testimonials" element={<Testimonials />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
