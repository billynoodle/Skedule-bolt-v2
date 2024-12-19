import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
          <div className="relative py-16 px-8 sm:px-16 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to transform your material scheduling?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of construction professionals who are already saving time and reducing errors.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-blue-600 bg-white hover:bg-blue-50"
              >
                Start free trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center px-6 py-3 border border-white rounded-lg text-base font-medium text-white hover:bg-white/10"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}