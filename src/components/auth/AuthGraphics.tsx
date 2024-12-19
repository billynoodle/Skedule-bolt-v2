import React from 'react';
import { FileText, Users, Ruler, Pencil } from 'lucide-react';

export function AuthGraphics() {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Feature Icons with Animations */}
      <div className="relative grid grid-cols-2 gap-4 p-6">
        <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Document Management</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Team Collaboration</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
            <Ruler className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Measurements</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-3">
            <Pencil className="w-6 h-6 text-pink-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Annotations</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl" />
    </div>
  );
}