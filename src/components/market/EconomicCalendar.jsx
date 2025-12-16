import React, { useState } from 'react';
import { MOCK_CALENDAR_EVENTS } from '../../data/mockCalendar';

const EconomicCalendar = ({ compact = false }) => {
    const [filterImpact, setFilterImpact] = useState('All'); // All, High, Medium, Low
    const [filterCurrency, setFilterCurrency] = useState('All'); // All, USD, EUR, etc.

    const filteredEvents = MOCK_CALENDAR_EVENTS.filter(item => {
        const impactMatch = filterImpact === 'All' || item.impact === filterImpact;
        const currencyMatch = filterCurrency === 'All' || item.currency === filterCurrency;
        return impactMatch && currencyMatch;
    });

    const currencies = ['All', ...new Set(MOCK_CALENDAR_EVENTS.map(i => i.currency))];
    const impacts = ['All', 'High', 'Medium', 'Low'];

    return (
        <div className={`bg-surface rounded-xl border border-gray-800 overflow-hidden ${compact ? 'text-sm' : ''}`}>
            {!compact && (
                <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Economic Calendar</h3>
                    <div className="flex gap-2">
                        <select
                            value={filterCurrency}
                            onChange={(e) => setFilterCurrency(e.target.value)}
                            className="bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-primary"
                        >
                            {currencies.map(c => <option key={c} value={c}>Cur: {c}</option>)}
                        </select>
                        <select
                            value={filterImpact}
                            onChange={(e) => setFilterImpact(e.target.value)}
                            className="bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-primary"
                        >
                            {impacts.map(i => <option key={i} value={i}>Imp: {i}</option>)}
                        </select>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                            <th className="p-3">Time</th>
                            <th className="p-3">Cur</th>
                            {compact ? (
                                <th className="p-3">Event</th>
                            ) : (
                                <>
                                    <th className="p-3">Impact</th>
                                    <th className="p-3">Event</th>
                                    <th className="p-3 text-right">Actual</th>
                                    <th className="p-3 text-right">Forecast</th>
                                    <th className="p-3 text-right">Previous</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredEvents.map(event => (
                            <tr key={event.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="p-3 text-gray-300 whitespace-nowrap">{event.time}</td>
                                <td className="p-3 font-bold text-white">{event.currency}</td>
                                {compact ? (
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${event.impact === 'High' ? 'bg-red-500' :
                                                    event.impact === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                                                }`}></span>
                                            <span className="text-white truncate max-w-[150px]">{event.event}</span>
                                        </div>
                                    </td>
                                ) : (
                                    <>
                                        <td className="p-3">
                                            <span className={`text-xs px-2 py-1 rounded font-bold ${event.impact === 'High' ? 'bg-red-500/20 text-red-500' :
                                                    event.impact === 'Medium' ? 'bg-orange-500/20 text-orange-500' :
                                                        'bg-green-500/20 text-green-500'
                                                }`}>
                                                {event.impact}
                                            </span>
                                        </td>
                                        <td className="p-3 font-medium text-white">{event.event}</td>
                                        <td className={`p-3 text-right font-bold ${event.actual && parseFloat(event.actual) > parseFloat(event.forecast) ? 'text-green-500' :
                                                event.actual ? 'text-red-500' : 'text-gray-500'
                                            }`}>
                                            {event.actual || '-'}
                                        </td>
                                        <td className="p-3 text-right text-gray-400">{event.forecast || '-'}</td>
                                        <td className="p-3 text-right text-gray-400">{event.previous || '-'}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {filteredEvents.length === 0 && (
                            <tr>
                                <td colSpan={compact ? 3 : 7} className="p-4 text-center text-gray-500">
                                    No events found matching filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EconomicCalendar;
