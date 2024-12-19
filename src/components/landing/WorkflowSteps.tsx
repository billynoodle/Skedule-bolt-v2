import React, { useEffect, useRef } from 'react';
import { FolderUp, BoxSelect, Table2, Send, ArrowRight } from 'lucide-react';
import { landingLogger } from '../../utils/landingLogger';

export function WorkflowSteps() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            landingLogger.viewSection('WorkflowSteps');
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

  const steps = [
    {
      icon: FolderUp,
      title: 'Upload Plans',
      description: 'Upload your construction plans in PDF format',
      color: 'blue'
    },
    {
      icon: BoxSelect,
      title: 'Select Areas',
      description: 'Highlight areas to be scheduled on your plans',
      color: 'indigo'
    },
    {
      icon: Table2,
      title: 'Generate Schedule',
      description: 'Automatically extract and organize material data',
      color: 'purple'
    },
    {
      icon: Send,
      title: 'Share & Export',
      description: 'Send schedules directly to manufacturers',
      color: 'pink'
    }
  ];

  const handleStepHover = (stepTitle: string) => {
    landingLogger.workflowStepView(stepTitle);
  };

  return (
    <section ref={sectionRef} className="relative py-24">
      {/* Grid Pattern Underlay */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%234338ca' stroke-width='0.5' stroke-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
              <p className="mt-4 text-lg text-gray-600">
                Four simple steps to transform your material scheduling
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-8 left-12 right-12 border-t-2 border-gray-100" />
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="relative group"
                    onMouseEnter={() => handleStepHover(step.title)}
                  >
                    <div className="h-full bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                      <div className={`w-12 h-12 rounded-xl bg-${step.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <step.icon className={`w-6 h-6 text-${step.color}-600`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden lg:block absolute -right-6 top-10 w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}