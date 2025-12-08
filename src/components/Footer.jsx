import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#05080f] border-t border-gray-800/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <Link to="/" className="text-2xl font-bold tracking-tighter text-secondary">
                            Forex<span className="text-accent">Volcano</span>
                        </Link>
                        <p className="mt-2 text-sm text-gray-500">
                            © {new Date().getFullYear()} ForexVolcano. All rights reserved.
                        </p>
                    </div>

                    <div className="flex space-x-8">
                        <Link to="/analysis" className="text-gray-400 hover:text-white transition-colors">Analysis</Link>
                        <Link to="/news" className="text-gray-400 hover:text-white transition-colors">News</Link>
                        <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
