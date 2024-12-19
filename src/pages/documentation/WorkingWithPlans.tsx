import React from 'react';
import { Upload, Search, FolderOpen } from 'lucide-react';

export function WorkingWithPlans() {
  return (
    <div className="space-y-12">
      <section id="uploading" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Uploading Plans</h2>
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            You can upload construction plans in various formats including PDF, PNG, and JPEG.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Drag & Drop</h3>
              </div>
              <p className="text-sm text-gray-600">
                Simply drag and drop your files into the upload area
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Browse Files</h3>
              </div>
              <p className="text-sm text-gray-600">
                Click to browse and select files from your computer
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Bulk Upload</h3>
              </div>
              <p className="text-sm text-gray-600">
                Upload multiple files at once for batch processing
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="viewing" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Viewing Plans</h2>
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Our viewer provides a range of tools to help you examine plans in detail.
          </p>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Viewer Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-gray-600">Zoom in/out with mouse wheel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-gray-600">Pan by clicking and dragging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-gray-600">Rotate view as needed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-gray-600">Multiple page navigation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Jobs</h2>
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Jobs help you organize your plans and keep track of different projects.
          </p>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Job Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Basic Information</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Job title and description</li>
                  <li>Client information</li>
                  <li>Project dates</li>
                  <li>Status tracking</li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Document Management</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Multiple plan uploads</li>
                  <li>Version control</li>
                  <li>Annotation history</li>
                  <li>Sharing settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}