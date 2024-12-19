import React from 'react';

interface AutoLinkToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function AutoLinkToggle({ enabled, onChange }: AutoLinkToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
        ${enabled 
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
      title={`${enabled ? 'Disable' : 'Enable'} automatic linking`}
    >
      Auto-link {enabled ? 'ON' : 'OFF'}
    </button>
  );
}