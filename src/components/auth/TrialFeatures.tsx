import React from 'react';
import { Check } from 'lucide-react';

export function TrialFeatures() {
  const features = [
    'Unlimited document uploads',
    'Full annotation features',
    'Material schedule extraction',
    'Team collaboration tools',
    'Priority support'
  ];

  return (
    <div className="mt-6 px-6 py-5 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-base font-semibold text-gray-900">
        Free trial includes:
      </h3>
      <ul className="mt-4 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-[15px] text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-center text-gray-500">
        No credit card required • Cancel anytime
      </p>
    </div>
  );
}