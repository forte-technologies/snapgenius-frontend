import React from 'react';
// import PublicNavbar from '../components/PublicNavbar'; // Removed

// Define colors
const primaryBlue = '#3366FF';
const headingCharcoal = '#1F2937';
const bodyGray = '#475569';
// const borderGray = '#E5E7EB'; // Removed unused constant

function Pricing() {
  // Placeholder data - replace with actual plans
  const plans = [
    { name: 'Free Tier', price: '$0', description: 'Get started with basic features.', features: ['50 Uploads', 'Basic Chat', 'Limited History'], cta: 'Get Started' },
    { name: 'Pro Plan', price: '$10', description: 'For power users and professionals.', features: ['Unlimited Uploads', 'All Chat Modes', 'Full History', 'Priority Support'], cta: 'Upgrade to Pro', popular: true },
    { name: 'Team Plan', price: 'Contact Us', description: 'Collaborate with your team.', features: ['Pro Features', 'Team Management', 'Shared Workspaces', 'Custom Integrations'], cta: 'Contact Sales' },
  ];

  return (
    // Standard section padding and container
    <div className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <h1 
            className="text-4xl font-bold tracking-tight sm:text-5xl text-center mb-4"
            style={{ color: headingCharcoal }}
        >
            Simple, Transparent Pricing
        </h1>
        <p 
            className="mt-2 text-lg leading-relaxed text-center max-w-2xl mx-auto mb-12 lg:mb-16"
            style={{ color: bodyGray }}
        >
            Choose the plan that's right for you. Get started for free, no credit card required.
        </p>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => (
                <div 
                    key={plan.name}
                    className={`relative flex flex-col rounded-2xl shadow-sm p-8 ring-1 ring-gray-200 ${plan.popular ? 'ring-2 ring-blue-500' : 'ring-gray-200'}`}
                    style={{ backgroundColor: 'white' }}
                >
                     {plan.popular && (
                        <p className="absolute top-0 -translate-y-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold leading-5 text-white">
                            Most popular
                        </p>
                     )}
                     <h3 
                        className="text-xl font-semibold leading-7"
                        style={{ color: headingCharcoal }}
                    >
                        {plan.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: bodyGray }}>{plan.description}</p>
                    <p className="mt-4">
                        <span 
                            className="text-4xl font-bold tracking-tight"
                             style={{ color: headingCharcoal }}
                        >
                            {plan.price}
                        </span>
                        {plan.price !== 'Contact Us' && <span className="text-sm font-semibold leading-6" style={{ color: bodyGray }}>/month</span>}
                    </p>
                    <ul role="list" className="mt-6 space-y-3 text-sm leading-6 flex-grow" style={{ color: bodyGray }}>
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex gap-x-3 items-center">
                                <svg className="h-5 w-5 flex-none text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        // Placeholder onClick - update later
                        className="font-poppins mt-8 block w-full rounded-full px-6 py-3 text-center text-sm font-medium text-white shadow-sm hover:opacity-90 transition"
                        style={{ backgroundColor: primaryBlue }}
                    >
                        {plan.cta}
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing; 