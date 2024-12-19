import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { log } from '../../utils/logger';

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { session } = useSupabase();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = () => {
    if (session) {
      log('LandingHeader', 'User clicked dashboard');
      navigate('/dashboard');
    } else {
      log('LandingHeader', 'User clicked sign in');
      navigate('/auth');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors duration-300 ${
              isScrolled 
                ? 'bg-blue-50 group-hover:bg-blue-100' 
                : 'bg-white/90 backdrop-blur-sm shadow-sm'
            }`}>
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-xl font-semibold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Skedule
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/docs" 
              className={`transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Documentation
            </Link>
            <button
              onClick={handleAction}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white'
              }`}
            >
              {session ? 'Dashboard' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}