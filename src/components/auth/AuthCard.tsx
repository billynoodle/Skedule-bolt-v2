import React from 'react';
import { Building2 } from 'lucide-react';
import { AuthForm } from './AuthForm';
import { SocialButtons } from './SocialButtons';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  initialMode?: 'signin' | 'signup';
}

export function AuthCard({ initialMode = 'signin' }: AuthCardProps) {
  return (
    <div className="w-full max-w-[424px] mx-auto">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Skedule
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">
            {initialMode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-base text-gray-600">
            {initialMode === 'signup' 
              ? 'Start your free trial today'
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        <div className="px-8 pb-8">
          <SocialButtons />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with email</span>
            </div>
          </div>
          <AuthForm initialMode={initialMode} />
        </div>
      </div>
    </div>
  );
}