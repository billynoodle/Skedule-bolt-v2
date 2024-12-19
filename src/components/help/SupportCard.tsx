import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SupportCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  action: string;
  color: string;
  onClick?: () => void;
}

export function SupportCard({ title, icon: Icon, description, action, color, onClick }: SupportCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-${color}-50`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <button 
        onClick={onClick}
        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      >
        {action}
      </button>
    </div>
  );
}