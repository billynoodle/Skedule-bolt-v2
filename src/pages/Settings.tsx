import React from 'react';
import { Bell, Shield, Palette } from 'lucide-react';
import { SettingSection } from '../components/settings/SettingSection';
import { DeleteAccountSection } from '../components/settings/DeleteAccountSection';

export function Settings() {
  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure how you receive alerts and updates',
      settings: [
        {
          id: 'email-notifications',
          label: 'Email Notifications',
          description: 'Receive updates about your projects via email'
        },
        {
          id: 'push-notifications',
          label: 'Push Notifications',
          description: 'Get instant notifications in your browser'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Manage your security preferences and data',
      settings: [
        {
          id: 'two-factor',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account'
        },
        {
          id: 'session-management',
          label: 'Session Management',
          description: 'View and manage your active sessions'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Customize how the application looks',
      settings: [
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose between light and dark mode'
        },
        {
          id: 'density',
          label: 'Density',
          description: 'Adjust the spacing between elements'
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and application settings
          </p>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <SettingSection
                key={section.title}
                title={section.title}
                icon={section.icon}
                description={section.description}
                settings={section.settings}
              />
            ))}
            
            <DeleteAccountSection />
          </div>
        </div>
      </div>
    </div>
  );
}