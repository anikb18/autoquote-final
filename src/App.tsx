import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { MediaDashboard } from '@/components/dashboard/MediaDashboard';
import { Home } from '@/components/Home';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { ForgotPassword } from '@/components/auth/ForgotPassword';
import { ResetPassword } from '@/components/auth/ResetPassword';
import { Profile } from '@/components/profile/Profile';
import { Settings } from '@/components/settings/Settings';
import { Quotes } from '@/components/quotes/Quotes';
import { NewQuote } from '@/components/quotes/NewQuote';
import { QuoteDetails } from '@/components/quotes/QuoteDetails';
import { DealerDashboard } from '@/components/dealer/DealerDashboard';
import { DealerProfile } from '@/components/dealer/DealerProfile';
import { DealerQuotes } from '@/components/dealer/DealerQuotes';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminDealers } from '@/components/admin/AdminDealers';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="quotes/new" element={<NewQuote />} />
          <Route path="quotes/:id" element={<QuoteDetails />} />
          <Route path="dealer" element={<DealerDashboard />} />
          <Route path="dealer/profile" element={<DealerProfile />} />
          <Route path="dealer/quotes" element={<DealerQuotes />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/dealers" element={<AdminDealers />} />
          <Route path="media" element={<MediaDashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
