import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PageContainer from './components/layout/PageContainer';
import DashboardPage from './pages/DashboardPage';
import TechniciansPage from './pages/TechniciansPage';
import AssetsPage from './pages/AssetsPage';
import LocationsPage from './pages/LocationsPage';
import JobsPage from './pages/JobsPage';
import AvailabilityPage from './pages/AvailabilityPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {!isAuthPage && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isAuthPage && <Navbar />}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 ${isAuthPage ? 'p-0' : ''}`}>
          {isAuthPage ? (
             <Routes>
               <Route path="/login" element={<LoginPage />} />
               <Route path="/signup" element={<SignupPage />} />
             </Routes>
          ) : (
            <PageContainer>
              <Routes>
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/technicians" element={<ProtectedRoute><TechniciansPage /></ProtectedRoute>} />
                <Route path="/assets" element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
                <Route path="/locations" element={<ProtectedRoute><LocationsPage /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
                <Route path="/availability" element={<ProtectedRoute><AvailabilityPage /></ProtectedRoute>} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </PageContainer>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
