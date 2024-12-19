import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { landingLogger } from '../../utils/landingLogger';

export function Hero() {
  const navigate = useNavigate();

  const handleCTAClick = (type: string) => {
    landingLogger.clickCTA(type, type === 'trial' ? '/auth?signup=true' : '/demo');
    navigate(type === 'trial' ? '/auth?signup=true' : '/demo');
  };

  return (
    <div className="relative overflow-hidden pt-16"> {/* Reduced from pt-24 to pt-16 */}
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"
        style={{ opacity: 0.1 }}
      />

      {/* Hero Content */}
      <div className="relative pt-20 pb-16 sm:pb-24"> {/* Reduced from pt-32 to pt-20 */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Transform your construction <br />
              material scheduling
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
              Automate material schedule extraction from construction plans. Save time, reduce errors, and streamline your workflow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => handleCTAClick('trial')}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Start free trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => handleCTAClick('demo')}
                className="inline-flex items-center px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                View demo
              </button>
            </div>
          </div>

          {/* Preview Window */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
            </div>
            <div className="relative max-w-4xl mx-auto">
              <div className="w-full bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden">
                <div className="h-8 bg-gray-100/90 backdrop-blur-sm flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="aspect-[16/9] relative bg-gray-900 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80"
                    alt="Construction plan example"
                    className="absolute inset-0 w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent" />
                  <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                    Processing plan...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}