import React from 'react';
import { Building2, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const navigation = {
    product: [
      { name: 'Features', href: '/docs#features' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Updates', href: '/updates' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'API Status', href: '/status' },
      { name: 'Contact', href: '/contact' },
      { name: 'Support', href: '/support' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' }
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'License', href: '/license' },
      { name: 'Security', href: '/security' }
    ],
    social: [
      {
        name: 'GitHub',
        href: '#',
        icon: Github
      },
      {
        name: 'Twitter',
        href: '#',
        icon: Twitter
      },
      {
        name: 'LinkedIn',
        href: '#',
        icon: Linkedin
      }
    ]
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-blue-50 to-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Construction Plan Viewer
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Professional construction plan viewing and annotation tools for modern teams.
            </p>
            <div className="mt-4 flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Construction Plan Viewer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}