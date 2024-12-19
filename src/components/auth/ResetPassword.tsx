import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { log } from '../../utils/logger';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Show loading state immediately
      navigate('/auth/check-email', { 
        state: { email, loading: true },
        replace: true 
      });
      
      await resetPassword(email);
      log('ResetPassword', 'Reset email sent successfully');
      
      // Update state to show success
      navigate('/auth/check-email', { 
        state: { email, loading: false },
        replace: true 
      });
    } catch (error) {
      console.error('Reset password error:', error);
      setIsSubmitting(false);
      navigate('/auth/reset-password', {
        state: { 
          error: 'Failed to send reset instructions. Please try again.',
          email 
        },
        replace: true
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 flex items-center justify-center rounded-full mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Reset password
          </h2>
          
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isSubmitting}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full p-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending instructions...
              </span>
            ) : (
              'Send reset instructions'
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/auth')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </form>
      </div>
    </div>
  );
}