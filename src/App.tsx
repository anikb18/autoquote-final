import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { MediaDashboard } from '@/components/dashboard/MediaDashboard';
import { Home } from '@/components/Home';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <>
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