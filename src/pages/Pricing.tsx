import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, getUserSubscription } from '../lib/supabase';

const PricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for occasional use',
    features: [
      '25 images per month',
      'Basic image resizing',
      'JPG and PNG support',
      'Standard quality optimization',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    description: 'For professional content creators',
    features: [
      'Unlimited images',
      'Batch processing',
      'All image formats including WebP',
      'Premium quality optimization',
      'Social media presets',
      'Custom presets',
      'Priority support',
    ],
    cta: 'Upgrade Now',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$29.99',
    period: 'per month',
    description: 'For teams and businesses',
    features: [
      'Everything in Premium',
      'Up to 5 team members',
      'Team presets and templates',
      'Advanced analytics',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const Pricing = () => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (user) {
          setUser(user);
          
          // Fetch subscription data
          const { subscription } = await getUserSubscription(user.id);
          setSubscription(subscription);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const getCurrentPlan = () => {
    if (!user) return null;
    return subscription?.plan || 'free';
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="space-y-10 py-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
          Choose the perfect plan for your image processing needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {PricingPlans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.name.toLowerCase();
          
          return (
            <div 
              key={plan.name}
              className={`card relative ${
                plan.highlighted 
                  ? 'border-2 border-indigo-500 dark:border-indigo-400' 
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  {isLoading ? (
                    <button disabled className="w-full btn btn-outline">
                      Loading...
                    </button>
                  ) : isCurrentPlan ? (
                    <button disabled className="w-full btn btn-outline bg-gray-100 dark:bg-gray-700">
                      Current Plan
                    </button>
                  ) : !user ? (
                    <Link to="/register" className={`w-full btn ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}>
                      {plan.cta}
                    </Link>
                  ) : (
                    <button className={`w-full btn ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}>
                      {plan.cta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            <span className="block">Need a custom solution?</span>
            <span className="block text-indigo-600 dark:text-indigo-400">Contact our sales team for enterprise pricing.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="mailto:sales@resizemaster.com"
                className="btn btn-primary"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {[
            {
              question: 'What happens if I exceed my monthly limit?',
              answer: 'On the Free plan, once you reach your 25 image limit, you\'ll need to upgrade to continue processing images. Your counter resets at the beginning of each month.',
            },
            {
              question: 'Can I cancel my subscription at any time?',
              answer: 'Yes, you can cancel your Premium or Team subscription at any time. You\'ll continue to have access until the end of your billing period.',
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards, PayPal, and Apple Pay.',
            },
            {
              question: 'Is there a limit to image file size?',
              answer: 'Free users can upload images up to 10MB. Premium and Team users can upload images up to 50MB.',
            },
            {
              question: 'Do you offer refunds?',
              answer: 'We offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team.',
            },
          ].map((faq, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
