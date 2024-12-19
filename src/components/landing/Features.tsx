import React, { useEffect, useRef } from 'react';
import { FileText, Users, Table2, GitMerge, Send, BarChart3 } from 'lucide-react';
import { landingLogger } from '../../utils/landingLogger';

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            landingLogger.viewSection('Features');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'Smart Plan Processing',
      description: 'Automatically process and analyze construction plans with precision.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time annotations and comments.',
      color: 'indigo'
    },
    {
      icon: Table2,
      title: 'Material Scheduling',
      description: 'Generate accurate material schedules with automated extraction.',
      color: 'purple'
    },
    {
      icon: GitMerge,
      title: 'Version Control',
      description: 'Track changes and maintain a complete history of your plans.',
      color: 'pink'
    },
    {
      icon: Send,
      title: 'Direct Manufacturing',
      description: 'Send schedules directly to manufacturers in their preferred format.',
      color: 'rose'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Gain valuable insights with detailed analytics and reporting.',
      color: 'orange'
    }
  ];

  const handleFeatureHover = (featureTitle: string) => {
    landingLogger.featureInteraction(featureTitle, 'hover');
  };

  return (
    <section ref={sectionRef} className="relative pt-8 pb-32">
      {/* Grid Pattern Underlay */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%234338ca' stroke-width='0.5' stroke-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Fade out to white at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Everything you need to manage construction plans</h2>
              <p className="mt-4 text-lg text-gray-600">
                Powerful features designed for construction professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="relative group"
                  onMouseEnter={() => handleFeatureHover(feature.title)}
                >
                  <div className="h-full bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}