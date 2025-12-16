import React from 'react';
import SEO from '../components/SEO';

const About = () => {
    return (
        <div className="min-h-screen bg-background text-text">
            <SEO title="About Us" description="Learn about ForexVolcano's mission to empower traders worldwide with professional analysis and education." />

            {/* Hero Section */}
            <div className="relative py-20 bg-surface border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Empowering Your Trading Journey</h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We believe that with the right tools, knowledge, and discipline, anyone can navigate the financial markets successfully.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Our Story */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-primary pl-4">Our Story</h2>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p className="mb-4">
                            ForexVolcano was founded by a group of professional traders and financial analysts who saw a gap in the market for high-quality, actionable market intelligence accessible to retail traders.
                        </p>
                        <p>
                            Starting as a small community of passionate chartists, we have grown into a comprehensive platform providing real-time news, deep-dive analysis, and educational resources to thousands of traders around the globe.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-surface p-8 rounded-xl border border-gray-800">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                        <p className="text-gray-400">
                            To democratize professional-grade market analysis and provide traders with the clarity they need to make informed decisions in a chaotic market environment.
                        </p>
                    </div>

                    <div className="bg-surface p-8 rounded-xl border border-gray-800">
                        <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                        <p className="text-gray-400">
                            To become the world's most trusted source for independent financial education and market foresight, fostering a community of disciplined and profitable traders.
                        </p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-accent pl-4">Why Choose ForexVolcano?</h2>
                    <ul className="space-y-6">
                        {[
                            { title: 'Unbiased Analysis', desc: 'We are independent analysts. Our goal is accuracy, not broker commissions.' },
                            { title: 'Real-Time Updates', desc: 'Markets move fast. Our team ensures you stay ahead of the curve with breaking news.' },
                            { title: 'Community Focused', desc: 'We believe in the power of collective intelligence. Navigate the markets with peers.' }
                        ].map((item, idx) => (
                            <li key={idx} className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center font-bold text-sm mt-1">✓</span>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                    <p className="text-gray-400">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default About;
