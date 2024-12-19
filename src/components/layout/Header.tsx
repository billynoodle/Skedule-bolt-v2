import React, { useState } from 'react';
import { Menu, X, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';

export function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { session } = useSupabase();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleDemo = () => {
    navigate('/demo');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-14 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-label="Open navigation menu"
            >
              {isNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-blue-50 to-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Skedule
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!session && (
              <>
                <button
                  onClick={handleDemo}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Try Demo
                </button>
                <button
                  onClick={handleSignIn}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </button>
              </>
            )}
            {session && <UserMenu user={session.user} />}
          </div>
        </div>
      </div>

      <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </header>
  );
}