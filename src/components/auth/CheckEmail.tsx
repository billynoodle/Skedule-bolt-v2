import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

interface LocationState {
  email?: string;
  loading?: boolean;
}

export function CheckEmail() {
  const location = useLocation();
  const { email, loading } = location.state as LocationState || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 flex items-center justify-center rounded-full mb-6">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            ) : (
              <Mail className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {loading ? 'Sending instructions...' : 'Check your email'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {loading ? (
              'Please wait while we send the reset instructions...'
            ) : (
              email ? (
                <>
                  We've sent password reset instructions to{' '}
                  <span className="font-medium text-gray-900">{email}</span>
                </>
              ) : (
                'We\'ve sent you password reset instructions'
              )
            )}
          </p>

          {!loading && (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">
                  Next steps:
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>1. Check your email inbox</li>
                  <li>2. Click the reset link in the email</li>
                  <li>3. Create your new password</li>
                </ul>
              </div>

              <div className="space-y-4">
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
                
                <p className="text-sm text-gray-500">
                  Didn't receive the email?{' '}
                  <Link 
                    to="/auth/reset-password" 
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Try again
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}