import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { MediaDashboard } from '@/components/dashboard/MediaDashboard';
import { Home } from '@/components/Home';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="media" element={<MediaDashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}