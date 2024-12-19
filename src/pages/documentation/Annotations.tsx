import React from 'react';
import { Square, Type, Ruler } from 'lucide-react';

export function Annotations() {
  return (
    <div className="space-y-12">
      <section id="creating-annotations" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating Annotations</h2>
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Annotations allow you to mark up construction plans with various types of information.
          </p>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Available Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Square className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rectangle</p>
                    <p className="text-sm text-gray-600">Mark areas and sections</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Type className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Text</p>
                    <p className="text-sm text-gray-600">Add notes and labels</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Ruler className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Measurement</p>
                    <p className="text-sm text-gray-600">Calculate distances</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="editing-annotations" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Editing Annotations</h2>
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            All annotations can be modified after creation using our intuitive editing tools.
          </p>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Editing Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-gray-600">Resize using corner handles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-gray-600">Rotate annotations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-gray-600">Move by dragging</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-gray-600">Delete with keyboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="annotation-types" className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Annotation Types</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-3">Rectangle Annotations</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Highlight specific areas</li>
              <li>Mark regions for review</li>
              <li>Define work zones</li>
              <li>Customizable colors and styles</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-3">Text Annotations</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Add comments and notes</li>
              <li>Label important elements</li>
              <li>Provide instructions</li>
              <li>Multiple font sizes and styles</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-3">Measurement Annotations</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Measure distances and areas</li>
              <li>Calculate dimensions</li>
              <li>Multiple unit support</li>
              <li>Automatic scaling</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}