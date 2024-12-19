import React from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';

interface DemoRouteProps {
  children: React.ReactNode;
}

export function DemoRoute({ children }: DemoRouteProps) {
  const { session } = useSupabase();

  // Allow access to both authenticated and unauthenticated users
  // This is specifically for demo/preview functionality
  return <>{children}</>;
}