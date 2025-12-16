import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_PAIRS = [
    { symbol: 'EURUSD', price: 1.0850, change: 0.15 },
    { symbol: 'GBPUSD', price: 1.2640, change: -0.05 },
    { symbol: 'USDJPY', price: 148.20, change: 0.32 },
    { symbol: 'XAUUSD', price: 2035.50, change: 0.85 },
    { symbol: 'BTCUSD', price: 42500.00, change: 1.20 },
    { symbol: 'AUDUSD', price: 0.6580, change: -0.12 },
    { symbol: 'USDCAD', price: 1.3450, change: 0.08 },
    { symbol: 'NZDUSD', price: 0.6120, change: -0.25 },
    { symbol: 'USDCHF', price: 0.8790, change: 0.10 },
    { symbol: 'WTI', price: 76.50, change: 0.50 }
];

const MarketWatch = () => {
    const [pairs, setPairs] = useState(INITIAL_PAIRS);

    useEffect(() => {
        const interval = setInterval(() => {
            setPairs(currentPairs =>
                currentPairs.map(pair => {
                    // Simulate random micro-movements
                    const move = (Math.random() - 0.5) * (pair.price * 0.0005);
                    const newPrice = pair.price + move;
                    return {
                        ...pair,
                        price: newPrice,
                        // Change also fluctuates slightly
                        change: pair.change + (Math.random() - 0.5) * 0.02
                    };
                })
            );
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price, symbol) => {
        if (symbol.includes('JPY') || symbol === 'WTI' || symbol === 'XAUUSD') {
            return price.toFixed(2);
        }
        if (symbol === 'BTCUSD') {
            return price.toFixed(0);
        }
        return price.toFixed(5);
    };

    return (
        <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-800 bg-gray-900/50">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Live Market
                </h3>
            </div>

            <div className="divide-y divide-gray-800">
                {pairs.map(pair => (
                    <Link
                        key={pair.symbol}
                        to={`/market/${pair.symbol}`}
                        className="flex justify-between items-center px-3 py-2 hover:bg-gray-800/50 transition-colors group"
                    >
                        <div>
                            <span className="font-bold text-sm text-white block group-hover:text-primary transition-colors">{pair.symbol}</span>
                            <span className={`text-[10px] ${pair.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                            </span>
                        </div>
                        <div className="text-right">
                            <div className={`font-mono text-xs font-medium ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatPrice(pair.price, pair.symbol)}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="p-2 bg-gray-900/50 text-center border-t border-gray-800">
                <Link to="/market" className="text-[10px] text-primary font-bold hover:underline">
                    View All &rarr;
                </Link>
            </div>
        </div>
    );
};

export default MarketWatch;
