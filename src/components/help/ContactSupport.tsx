import React from 'react';

export function ContactSupport() {
  return (
    <div className="mt-12 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Still need help?
      </h2>
      <p className="text-gray-600 mb-6">
        Our support team is available 24/7 to assist you with any questions or concerns.
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
        Contact Support Team
      </button>
    </div>
  );
}