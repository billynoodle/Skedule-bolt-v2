import React from 'react';
import { MessageCircle, Book, Phone, Mail, Video, FileQuestion } from 'lucide-react';
import { SupportCard } from '../components/help/SupportCard';
import { ContactSupport } from '../components/help/ContactSupport';

export function Help() {
  const supportOptions = [
    {
      title: 'Live Chat',
      icon: MessageCircle,
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      color: 'green'
    },
    {
      title: 'Documentation',
      icon: Book,
      description: 'Browse our comprehensive documentation',
      action: 'View Docs',
      color: 'blue'
    },
    {
      title: 'Phone Support',
      icon: Phone,
      description: 'Speak directly with a support representative',
      action: 'Call Now',
      color: 'purple'
    },
    {
      title: 'Email Support',
      icon: Mail,
      description: "Send us an email and we'll respond within 24 hours",
      action: 'Send Email',
      color: 'yellow'
    },
    {
      title: 'Video Tutorials',
      icon: Video,
      description: 'Watch step-by-step video guides',
      action: 'Watch Now',
      color: 'red'
    },
    {
      title: 'FAQs',
      icon: FileQuestion,
      description: 'Find answers to common questions',
      action: 'View FAQs',
      color: 'indigo'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-gray-900">Help & Support</h1>
            <p className="mt-2 text-lg text-gray-600">
              Get the help you need, when you need it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportOptions.map((option) => (
              <SupportCard
                key={option.title}
                {...option}
              />
            ))}
          </div>

          <ContactSupport />
        </div>
      </div>
    </div>
  );
}