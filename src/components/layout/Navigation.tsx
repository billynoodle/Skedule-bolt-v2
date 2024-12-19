import React from 'react';
import { Home, FileText, Settings, HelpCircle, LogIn, LogOut, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../hooks/useAuth';
import { log } from '../../utils/logger';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Navigation({ isOpen, onClose }: NavigationProps) {
  const { session } = useSupabase();
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/dashboard',
      description: 'View and manage all construction projects',
      requiresAuth: true
    },
    { 
      icon: FileText, 
      label: 'Documentation', 
      href: '/docs',
      description: 'Learn how to use the platform effectively',
      requiresAuth: false
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      href: '/settings',
      description: 'Configure your account and preferences',
      requiresAuth: true
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      href: '/help',
      description: 'Get help and contact support',
      requiresAuth: false
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && session)
  );

  const handleSignOut = async () => {
    log('Navigation', 'User signing out');
    await signOut();
    navigate('/', { replace: true });
    onClose();
  };

  const handleNavigation = (href: string) => {
    log('Navigation', 'User navigating', { destination: href });
    navigate(href);
    onClose();
  };

  return (
    <div
      className={`
        fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={onClose} />
      
      <nav className="relative flex flex-col w-80 max-w-xs h-full bg-white">
        <div className="flex-1 overflow-y-auto">
          {session && (
            <div className="px-4 py-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-lg">
                    {session.user.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-800">{session.user.email}</p>
                  <p className="text-sm text-gray-500">Signed in</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-6">
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    group flex flex-col w-full p-4 rounded-lg transition-colors duration-150
                    ${location.pathname === item.href 
                      ? 'bg-blue-50' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <item.icon className={`h-5 w-5 ${
                      location.pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-500 group-hover:text-blue-600'
                    }`} />
                    <span className={`ml-3 font-medium ${
                      location.pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-1 ml-8 text-sm text-gray-500">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          {session ? (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigation('/auth')}
              className="flex w-full items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              <LogIn className="mr-3 h-5 w-5" />
              <span className="font-medium">Sign In</span>
            </button>
          )}

          <div className="mt-4 flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Skedule
              </p>
              <p className="text-xs text-gray-500">
                Version 1.0.0
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}