import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DealershipLanding from "./components/DealershipLanding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dealership" element={<DealershipLanding />} />
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
            <ProtectedRoute requireSubscription={false}>
              <SubscriptionManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;