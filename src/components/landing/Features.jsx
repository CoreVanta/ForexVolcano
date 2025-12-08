import React from 'react';

const features = [
    {
        title: 'Structured Learning Path',
        description: 'From "What is a Pip?" to institutional order flow. Our curriculum guides you step-by-step through the chaos.',
        icon: (
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        borderColor: 'border-primary/20',
        iconBg: 'bg-primary/10',
    },
    {
        title: 'Daily Market Analysis',
        description: 'Don\'t trade alone. Get daily "Volcano Watch" reports identifying high-probability setups before they erupt.',
        icon: (
            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        borderColor: 'border-secondary/20',
        iconBg: 'bg-secondary/10',
    },
    {
        title: 'Risk Management',
        description: 'The volcano is dangerous. Learn how to survive. Our strict risk protocols are the core of our philosophy.',
        icon: (
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        borderColor: 'border-accent/20',
        iconBg: 'bg-accent/10',
    },
];

const Features = () => {
    return (
        <div className="py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Why Choose Us</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                        A Better Way to Trade
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className={`p-8 bg-background/50 border ${feature.borderColor} rounded-2xl hover:bg-background transition-all duration-300`}>
                            <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-6`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
