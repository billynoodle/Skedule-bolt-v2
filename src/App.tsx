import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { Header } from './components/layout/Header';
import { LandingHeader } from './components/layout/LandingHeader';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Documentation } from './pages/Documentation';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { MaterialSchedule } from './pages/MaterialSchedule';
import { Auth } from './pages/Auth';
import { AuthCallback } from './components/auth/AuthCallback';
import { ResetPassword } from './components/auth/ResetPassword';
import { UpdatePassword } from './components/auth/UpdatePassword';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { CheckEmail } from './components/auth/CheckEmail';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { DemoRoute } from './components/auth/DemoRoute';

export default function App() {
  return (
    <SupabaseProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white flex flex-col">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={
              <>
                <LandingHeader />
                <Landing />
              </>
            } />

            {/* Auth Routes */}
            <Route path="/auth/*" element={
              <Routes>
                <Route index element={<PublicRoute><Auth /></PublicRoute>} />
                <Route path="callback" element={<AuthCallback />} />
                <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                <Route path="check-email" element={<PublicRoute><CheckEmail /></PublicRoute>} />
                <Route path="update-password" element={<PublicRoute><UpdatePassword /></PublicRoute>} />
                <Route path="verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
                {/* Handle password reset link from email */}
                <Route path="reset" element={<PublicRoute><UpdatePassword /></PublicRoute>} />
              </Routes>
            } />

            {/* Main Layout with Header and Footer */}
            <Route element={
              <>
                <Header />
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="demo" element={<DemoRoute><Dashboard /></DemoRoute>} />
                    <Route path="docs" element={<Documentation />} />
                    <Route path="help" element={<Help />} />
                    <Route path="contact" element={<Help />} />

                    {/* Protected Routes */}
                    <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="schedule" element={<PrivateRoute><MaterialSchedule /></PrivateRoute>} />
                    <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                  </Routes>
                </main>
                <Footer />
              </>
            } path="/*" />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SupabaseProvider>
  );
}