import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ALL_PAIRS = [
    { category: 'Major Forex', pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'USDCAD', 'AUDUSD', 'NZDUSD'] },
    { category: 'Crosses', pairs: ['EURGBP', 'EURJPY', 'GBPJPY', 'AUDJPY', 'EURAUD'] },
    { category: 'Commodities', pairs: ['XAUUSD', 'XAGUSD', 'WTI', 'BRENT'] },
    { category: 'Crypto', pairs: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD'] },
    { category: 'Indices', pairs: ['US30', 'SPX500', 'NAS100', 'GER30'] }
];

const MarketAll = () => {
    return (
        <div className="min-h-screen bg-background pt-20 pb-10">
            <SEO title="All Markets" description="Browse all available trading instruments including Forex, Commodities, Crypto, and Indices." />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-white mb-8">All Markets</h1>

                <div className="space-y-12">
                    {ALL_PAIRS.map(section => (
                        <div key={section.category}>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">{section.category}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {section.pairs.map(pair => (
                                    <Link key={pair} to={`/market/${pair}`} className="block group">
                                        <div className="bg-surface border border-gray-800 rounded-lg p-4 hover:border-primary transition-all hover:scale-105">
                                            <div className="font-bold text-white text-lg group-hover:text-primary">{pair}</div>
                                            <div className="text-xs text-gray-500 mt-1">View Chart</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketAll;
