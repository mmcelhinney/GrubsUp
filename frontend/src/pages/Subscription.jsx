import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

export default function Subscription() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: 'per month',
      features: [
        'Unlimited fridge scans',
        'AI-powered recipe suggestions',
        'Save unlimited recipes',
        'Priority support',
        'Ad-free experience'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: 'per year',
      originalPrice: '$119.88',
      savings: 'Save 33%',
      features: [
        'Everything in Monthly',
        'Unlimited fridge scans',
        'AI-powered recipe suggestions',
        'Save unlimited recipes',
        'Priority support',
        'Ad-free experience',
        'Early access to new features'
      ]
    }
  ];

  const handleSubscribe = async (planId) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setSelectedPlan(planId);

    try {
      // TODO: Integrate with payment processor (Stripe, PayPal, etc.)
      // For now, just simulate subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(`Successfully subscribed to ${planId === 'monthly' ? 'Monthly' : 'Yearly'} plan!`);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to process subscription');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8">
        <Link
          to="/profile"
          className="text-orange-600 hover:text-orange-700 mb-4 inline-block"
        >
          ← Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,1)] border-2 border-white rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm inline-block">
          Choose Your Plan
        </h1>
        <p className="text-gray-700 mt-4 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] font-medium">
          Select a subscription plan that works best for you
        </p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card relative ${
              plan.id === 'yearly' ? 'border-2 border-orange-500' : ''
            }`}
          >
            {plan.id === 'yearly' && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                {plan.savings}
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-orange-600">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              {plan.originalPrice && (
                <p className="text-sm text-gray-500 line-through">{plan.originalPrice}</p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading}
              className={`btn w-full ${
                plan.id === 'yearly'
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
            >
              {loading && selectedPlan === plan.id
                ? 'Processing...'
                : user?.subscriptionType === plan.name
                ? 'Current Plan'
                : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Current Subscription Info */}
      {user?.subscriptionType && user.subscriptionType !== 'Free' && (
        <div className="mt-8 card bg-orange-50 border border-orange-200">
          <h3 className="text-lg font-semibold mb-2">Current Subscription</h3>
          <p className="text-gray-700">
            You are currently on the <strong>{user.subscriptionType}</strong> plan.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {user.subscriptionExpiresAt
              ? `Expires on: ${new Date(user.subscriptionExpiresAt).toLocaleDateString()}`
              : 'No expiration date'}
          </p>
        </div>
      )}
    </div>
  );
}

