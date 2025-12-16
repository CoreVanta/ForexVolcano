import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#05080f] border-t border-gray-800/50 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand & Description */}
                    <div>
                        <Link to="/" className="text-2xl font-bold tracking-tighter text-secondary inline-block mb-4">
                            Forex<span className="text-accent">Volcano</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            The ultimate platform for professional forex analysis, real-time market news, and expert trading courses. Empowering traders to predict market eruptions.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Icons Placeholder */}
                            {['twitter', 'facebook', 'instagram', 'youtube'].map((social) => (
                                <a key={social} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                    <span className="sr-only">{social}</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Market</h3>
                        <ul className="space-y-3">
                            <li><Link to="/analysis" className="text-gray-400 hover:text-primary transition-colors text-sm">Technical Analysis</Link></li>
                            <li><Link to="/news" className="text-gray-400 hover:text-primary transition-colors text-sm">Market News</Link></li>
                            <li><Link to="/calendar" className="text-gray-400 hover:text-primary transition-colors text-sm">Economic Calendar</Link></li>
                            <li><Link to="/market" className="text-gray-400 hover:text-primary transition-colors text-sm">Live Quotes</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Education & Community */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Education</h3>
                        <ul className="space-y-3">
                            <li><Link to="/academy" className="text-gray-400 hover:text-primary transition-colors text-sm">Trading Academy</Link></li>
                            <li><Link to="/community" className="text-gray-400 hover:text-primary transition-colors text-sm">Community Forum</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">Risk Management</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact Support</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
                        </ul>
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <p className="text-xs text-gray-600">
                                Trading involves risk. <Link to="/privacy" className="text-gray-500 hover:text-primary underline">Read Disclosure</Link>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} ForexVolcano. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span>Made with</span>
                        <svg className="w-3 h-3 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span>for Traders</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
