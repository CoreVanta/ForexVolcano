import React from 'react';
import EconomicCalendar from '../components/market/EconomicCalendar';
import SEO from '../components/SEO';

const CalendarPage = () => {
    return (
        <div className="min-h-screen bg-background pt-20 pb-10">
            <SEO title="Economic Calendar" description="Track key economic events, data releases, and market-moving news in real-time." />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Economic Calendar</h1>
                    <p className="text-gray-400">Stay ahead of market volatility with our real-time economic event tracker.</p>
                </div>

                <EconomicCalendar />
            </div>
        </div>
    );
};

export default CalendarPage;
