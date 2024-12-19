import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { landingLogger } from '../../utils/landingLogger';

export function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlanHover = (planName: string | null) => {
    if (planName) {
      landingLogger.hoverPlan(planName);
    }
    setHoveredPlan(planName);
  };

  const handlePlanClick = (planName: string, isCustom: boolean) => {
    const destination = isCustom ? '/contact' : '/auth?signup=true';
    landingLogger.clickPricingCTA(planName, destination);
    navigate(destination);
  };

  const plans = [
    {
      name: 'Starter',
      price: '49',
      description: 'Perfect for small teams and individual contractors',
      features: [
        'Up to 5 team members',
        '50 projects per month',
        'Basic annotations',
        'PDF exports',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: '99',
      description: 'Ideal for growing construction companies',
      features: [
        'Up to 20 team members',
        'Unlimited projects',
        'Advanced annotations',
        'All export formats',
        'Priority support',
        'API access',
        'Custom templates'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited team members',
        'Unlimited projects',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Training sessions',
        'Custom features'
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative transform transition-all duration-300 ease-out ${
                hoveredPlan === plan.name ? 'scale-[1.02]' : 'scale-100'
              }`}
              onMouseEnter={() => handlePlanHover(plan.name)}
              onMouseLeave={() => handlePlanHover(null)}
            >
              <div 
                className={`h-full flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl border overflow-hidden
                  ${plan.popular ? 'border-blue-200' : 'border-gray-200'}
                  ${hoveredPlan === plan.name ? 'shadow-2xl' : 'shadow-lg'}
                  transition-all duration-300 ease-out
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <div className="px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full shadow-md">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-200">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                  
                  <div className="mt-6 flex items-baseline">
                    <span className={`text-4xl font-bold transition-colors duration-200 ${
                      hoveredPlan === plan.name ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      ${plan.price}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="ml-2 text-gray-600">/month</span>
                    )}
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li 
                        key={feature} 
                        className="flex items-start opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full ${
                          hoveredPlan === plan.name ? 'bg-blue-100' : 'bg-gray-50'
                        } flex items-center justify-center transition-colors duration-200`}>
                          <Check className={`w-3.5 h-3.5 ${
                            hoveredPlan === plan.name ? 'text-blue-600' : 'text-gray-600'
                          } transition-colors duration-200`} />
                        </div>
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => handlePlanClick(plan.name, plan.price === 'Custom')}
                    className={`
                      group relative flex items-center justify-center w-full px-6 py-3 rounded-lg font-medium
                      transition-all duration-200 overflow-hidden
                      ${plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md'
                        : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="relative flex items-center">
                      {plan.price === 'Custom' ? 'Contact sales' : 'Start free trial'}
                      <ArrowRight className={`
                        ml-2 w-4 h-4 transform transition-transform duration-200
                        ${hoveredPlan === plan.name ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
                      `} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}