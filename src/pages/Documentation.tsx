import React, { useState } from 'react';
import { FileText, Box, Pencil, Users, Settings as SettingsIcon } from 'lucide-react';
import { GettingStarted } from './documentation/GettingStarted';
import { WorkingWithPlans } from './documentation/WorkingWithPlans';
import { Annotations } from './documentation/Annotations';

export function Documentation() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    {
      title: 'Getting Started',
      icon: FileText,
      items: [
        { id: 'introduction', label: 'Introduction' },
        { id: 'requirements', label: 'System Requirements' },
        { id: 'quickstart', label: 'Quick Start Guide' }
      ]
    },
    {
      title: 'Working with Plans',
      icon: Box,
      items: [
        { id: 'uploading', label: 'Uploading Plans' },
        { id: 'viewing', label: 'Viewing Plans' },
        { id: 'jobs', label: 'Managing Jobs' }
      ]
    },
    {
      title: 'Annotations',
      icon: Pencil,
      items: [
        { id: 'creating-annotations', label: 'Creating Annotations' },
        { id: 'editing-annotations', label: 'Editing Annotations' },
        { id: 'annotation-types', label: 'Annotation Types' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <nav className="p-4">
              {sections.map((section) => (
                <div key={section.title} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <section.icon className="w-4 h-4 text-gray-400" />
                    <h2 className="font-medium text-gray-900">{section.title}</h2>
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveSection(item.id);
                            const element = document.getElementById(item.id);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            activeSection === item.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="prose prose-blue max-w-none space-y-16">
              <GettingStarted />
              <WorkingWithPlans />
              <Annotations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
