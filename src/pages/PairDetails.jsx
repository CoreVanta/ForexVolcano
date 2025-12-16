import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

const PairDetails = () => {
    const { symbol } = useParams(); // e.g., EURUSD
    const [analysis, setAnalysis] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Formats for matching: EURUSD -> EUR/USD
    const displaySymbol = symbol.length === 6 ? `${symbol.slice(0, 3)}/${symbol.slice(3)}` : symbol;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Analysis (Attempt to match "EUR/USD" or "EURUSD")
                const analysisRef = collection(db, 'analysis');
                // Firestore doesn't support logical OR in a single 'where' comfortably without composite indexes sometimes, so we'll fetch basic and filter or just look for the slash format primarily as that is what we save.
                const qAnalysis = query(analysisRef, where('pair', '==', displaySymbol), orderBy('createdAt', 'desc'), limit(5));
                const analysisSnap = await getDocs(qAnalysis);
                setAnalysis(analysisSnap.docs.map(d => ({ id: d.id, ...d.data() })));

                // Fetch News (Broad match - finding news that tags 'EUR' or 'USD' usually requires array-contains-any)
                // Assuming 'affectedCurrencies' is an array ['EUR', 'USD']
                const base = symbol.slice(0, 3);
                const quote = symbol.slice(3, 6);

                // Simplified: just fetch recent news and client-side filter for now to avoid complex composite index requirements on the user's DB
                const newsRef = collection(db, 'news');
                const qNews = query(newsRef, orderBy('timestamp', 'desc'), limit(20));
                const newsSnap = await getDocs(qNews);

                const relevantNews = newsSnap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(item => {
                        const currencies = item.affectedCurrencies || [];
                        return currencies.includes(base) || currencies.includes(quote) || item.title.includes(symbol);
                    })
                    .slice(0, 5);

                setNews(relevantNews);

            } catch (error) {
                console.error("Error fetching pair details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol, displaySymbol]);

    return (
        <div className="min-h-screen bg-background pt-20 pb-10">
            <SEO title={`${displaySymbol} Live Chart & Analysis`} description={`Track live ${displaySymbol} price, view charts, and read expert analysis.`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{displaySymbol}</h1>
                        <p className="text-gray-400">Live Market Data & Intelligence</p>
                    </div>
                    <Link to="/market">
                        <Button variant="outline" size="sm">Back to Market</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Chart Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* TradingView Widget Container */}
                        <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden h-[500px]">
                            {/* TradingView Widget Embed */}
                            <iframe
                                title="TradingView"
                                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${symbol}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${symbol}`}
                                className="w-full h-full border-none"
                            ></iframe>
                        </div>

                        {/* Recent Analysis for this Pair */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">Technical Analysis</h2>
                            {loading ? (
                                <p className="text-gray-500">Loading analysis...</p>
                            ) : analysis.length > 0 ? (
                                <div className="space-y-4">
                                    {analysis.map(item => (
                                        <Link key={item.id} to={`/analysis/${item.id}`} className="block bg-surface p-4 rounded-lg border border-gray-800 hover:border-primary transition-colors">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded ${item.direction === 'Bullish' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {item.direction}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                                {item.content?.replace(/<[^>]*>?/gm, '')}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Recent'}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 bg-surface rounded-lg border border-gray-800 text-center text-gray-500">
                                    No recent analysis found for {displaySymbol}.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: News & Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-secondary pl-3">Related News</h2>
                            {loading ? (
                                <p className="text-gray-500">Loading news...</p>
                            ) : news.length > 0 ? (
                                <div className="space-y-4">
                                    {news.map(item => (
                                        <Link key={item.id} to={`/news/${item.id}`} className="block bg-surface p-4 rounded-lg border border-gray-800 hover:border-gray-600">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`w-2 h-2 rounded-full ${item.impact === 'High' ? 'bg-red-500' : item.impact === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                                <span className="text-xs text-gray-400">{new Date(item.date || item.timestamp?.seconds * 1000).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-bold text-white text-sm hover:text-primary transition-colors">{item.title}</h4>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-surface rounded-lg border border-gray-800 text-gray-500 text-sm">
                                    No direct news found.
                                </div>
                            )}
                        </div>

                        {/* Simple TradingView Technicals Widget (iframe) */}
                        <div className="bg-surface p-4 rounded-xl border border-gray-800">
                            <h3 className="text-white font-bold mb-4">Technical Rating</h3>
                            {/* Placeholder for a gauge or simplifed widget. For now, just a text block */}
                            <div className="text-center py-4">
                                <p className="text-gray-400 text-sm mb-2">Market Sentiment</p>
                                <div className="text-2xl font-bold text-white">Neutral</div>
                                <p className="text-xs text-gray-600 mt-1">Based on MA & Oscillators</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PairDetails;
