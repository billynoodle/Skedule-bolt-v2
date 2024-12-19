import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { AuthCard } from '../components/auth/AuthCard';

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSupabase();
  const searchParams = new URLSearchParams(location.search);
  const isSignUp = searchParams.get('signup') === 'true';

  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <AuthCard initialMode={isSignUp ? 'signup' : 'signin'} />
    </div>
  );
}