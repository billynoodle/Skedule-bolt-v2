import React from 'react';

export function GettingStarted() {
  return (
    <div className="space-y-12">
      <section id="introduction" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
        <p className="text-gray-600 leading-relaxed">
          Skedule is a powerful tool designed to help construction professionals view, annotate, and collaborate on construction plans. This documentation will guide you through all the features and capabilities of the platform.
        </p>
      </section>

      <section id="requirements" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">System Requirements</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-3">Supported Browsers</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Google Chrome (recommended) - version 88 or higher</li>
              <li>Mozilla Firefox - version 85 or higher</li>
              <li>Microsoft Edge - version 88 or higher</li>
              <li>Safari - version 14 or higher</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-3">Hardware Requirements</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Minimum 4GB RAM (8GB recommended)</li>
              <li>Modern processor (Intel i5/AMD Ryzen 5 or better)</li>
              <li>Stable internet connection</li>
              <li>Screen resolution: 1280x720 or higher</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="quickstart" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
        <div className="space-y-6">
          <div className="relative pl-8 pb-6">
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create an Account</h3>
            <p className="text-gray-600">Sign up for a new account or log in if you already have one.</p>
          </div>

          <div className="relative pl-8 pb-6">
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">2</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your First Job</h3>
            <p className="text-gray-600">Click the "New Job" button and fill in the basic details.</p>
          </div>

          <div className="relative pl-8 pb-6">
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">3</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Plans</h3>
            <p className="text-gray-600">Upload your construction plans in PDF format.</p>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">4</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Annotating</h3>
            <p className="text-gray-600">Use the annotation tools to mark up your plans.</p>
          </div>
        </div>
      </section>
    </div>
  );
}