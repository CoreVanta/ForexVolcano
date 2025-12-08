import React from 'react';
import Button from '../ui/Button';

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-background pt-16 pb-32 lg:pt-32 lg:pb-40">
            {/* Background Decor - "Volcano" Gradient Glow */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                    Predict the <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Eruption</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
                    Professional Forex education and institutional-grade analysis.
                    Stop guessing. Start trading with the precision of a geologist.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button to="/register" variant="primary" size="lg">
                        Start Learning Free
                    </Button>
                    <Button to="/analysis" variant="outline" size="lg">
                        View Daily Analysis
                    </Button>
                </div>

                {/* Floating Market Ticker Mockup */}
                <div className="mt-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-20 bottom-0 pointer-events-none"></div>
                    <div className="inline-flex items-center gap-8 py-3 px-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">EUR/USD</span>
                            <span className="text-primary text-sm">▲ 1.0842</span>
                        </div>
                        <div className="w-px h-4 bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">GBP/USD</span>
                            <span className="text-secondary text-sm">▼ 1.2615</span>
                        </div>
                        <div className="w-px h-4 bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">XAU/USD</span>
                            <span className="text-accent text-sm">▲ 2045.50</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
