'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$29',
    features: ['Video Campaigns', 'SMS Campaigns', 'Email Campaigns', 'Basic Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    features: [
      'All Basic Features',
      'Telemarketing Campaigns',
      'Advanced Analytics',
      'Priority Support',
      'API Access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'All Pro Features',
      'Custom Integrations',
      'Dedicated Support',
      'Custom Campaign Types',
      'White Labeling',
    ],
  },
];

export default function Payment() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose your plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-4 text-sm text-gray-500">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-500">/month</span>}
                </p>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Select plan
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
} 