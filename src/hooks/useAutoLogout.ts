import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { AUTH_CONFIG } from '../services/auth/config';
import { log } from '../utils/logger';

export function useAutoLogout() {
  const { signOut } = useSupabase();
  const navigate = useNavigate();
  const timeoutRef = useRef<number>();

  const resetTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(async () => {
      log('Auth', 'Auto logout due to inactivity');
      await signOut();
      navigate('/', { replace: true });
    }, AUTH_CONFIG.sessionTimeout);
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Set up event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [signOut, navigate]);
}