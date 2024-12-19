import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to{' '}
          <span className="font-medium text-gray-900">{email}</span>.
          Please check your inbox and click the link to verify your email address.
        </p>

        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 mb-6">
          <p className="mb-2 font-medium text-gray-900">Didn't receive the email?</p>
          <ul className="space-y-2 text-left list-disc list-inside">
            <li>Check your spam folder</li>
            <li>Make sure the email address is correct</li>
            <li>Wait a few minutes and check again</li>
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
        </div>
      </div>
    </div>
  );
}