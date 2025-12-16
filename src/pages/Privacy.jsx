import React from 'react';
import SEO from '../components/SEO';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background text-text">
            <SEO title="Privacy Policy & Terms" description="Read out Privacy Policy, Terms of Service, and Risk Disclosure." />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold text-white mb-8 border-b border-gray-800 pb-4">Legal Information</h1>

                <div className="space-y-12">

                    {/* Privacy Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
                        <div className="prose prose-invert max-w-none text-gray-400 space-y-4">
                            <p>Last updated: December 2025</p>
                            <p>
                                At ForexVolcano, accessible from www.forexvolcano.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ForexVolcano and how we use it.
                            </p>
                            <h3 className="text-white font-bold text-lg">Information We Collect</h3>
                            <p>
                                We collect information you provide directly to us when you register for an account, subscribe to our newsletter, or communicate with us. This guidance may include your name, email address, and any other information you choose to provide.
                            </p>
                            <h3 className="text-white font-bold text-lg">How We Use Your Information</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Provide, operate, and maintain our website</li>
                                <li>Improve, personalize, and expand our website</li>
                                <li>Understand and analyze how you use our website</li>
                                <li>Communicate with you, either directly or through one of our partners</li>
                                <li>Send you emails regarding market updates and analysis</li>
                            </ul>
                        </div>
                    </section>

                    {/* Terms of Service */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
                        <div className="prose prose-invert max-w-none text-gray-400 space-y-4">
                            <p>
                                By accessing this website we assume you accept these terms and conditions. Do not continue to use ForexVolcano if you do not agree to take all of the terms and conditions stated on this page.
                            </p>
                            <h3 className="text-white font-bold text-lg">Cookies</h3>
                            <p>
                                We employ the use of cookies. By accessing ForexVolcano, you agreed to use cookies in agreement with the ForexVolcano's Privacy Policy.
                            </p>
                            <h3 className="text-white font-bold text-lg">License</h3>
                            <p>
                                Unless otherwise stated, ForexVolcano and/or its licensors own the intellectual property rights for all material on ForexVolcano. All intellectual property rights are reserved. You may access this from ForexVolcano for your own personal use subjected to restrictions set in these terms and conditions.
                            </p>
                        </div>
                    </section>

                    {/* Risk Disclosure (CRITICAL for Forex sites) */}
                    <section className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">High Risk Warning & Disclaimer</h2>
                        <div className="prose prose-invert max-w-none text-gray-400 space-y-4 text-sm">
                            <p className="font-bold">
                                Trading Foreign Exchange (Forex) and Contracts for Differences (CFD) carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange, you should carefully consider your investment objectives, level of experience, and risk appetite.
                            </p>
                            <p>
                                The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with foreign exchange trading and seek advice from an independent financial advisor if you have any doubts.
                            </p>
                            <p>
                                <strong>No Financial Advice:</strong> The content on this website is for informational and educational purposes only and should not be construed as financial advice. The market analysis and signals provided differ from the actual market conditions and are not a guarantee of future performance.
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Privacy;
