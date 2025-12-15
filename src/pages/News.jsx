import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { auth, db } from '../firebase/config';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

const MOCK_NEWS = [
    {
        id: '1',
        title: 'NFP Smashes Expectations: 350k Jobs Added',
        impact: 'High',
        affectedCurrencies: ['USD', 'XAU', 'JPY'],
        content: 'The Non-Farm Payrolls report showed a surprise surge in job creation, sending the Dollar Index (DXY) rocketing past 104.50. Traders should watch for pullbacks on Gold.',
        timestamp: new Date().toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'ECB Signals Rate Cuts in June',
        impact: 'Medium',
        affectedCurrencies: ['EUR', 'GBP'],
        content: 'Lagarde hinted that inflation is under control, opening the door for a 25bps cut. Euro is showing weakness against the Pound.',
        timestamp: new Date().toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1526304640151-b59310398691?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'BoJ Maintains Ultra-Loose Policy',
        impact: 'Low',
        affectedCurrencies: ['JPY'],
        content: 'No surprises from the Bank of Japan. Yield Curve Control remains in place. USD/JPY is drifting sideways in a tight range.',
        timestamp: new Date().toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=1000&auto=format&fit=crop'
    }
];

const IMPACT_COLORS = {
    High: 'bg-red-500/20 text-red-500 border border-red-500/50',
    Medium: 'bg-orange-500/20 text-orange-500 border border-orange-500/50',
    Low: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50',
};

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper to strip HTML tags for preview
    const stripHtml = (html) => {
        if (!html) return "";
        // Replace block-level tags with spaces to prevent words from sticking together
        const htmlWithSpaces = html.replace(/<\/p>/gi, ' ')
            .replace(/<\/div>/gi, ' ')
            .replace(/<br\s*\/?>/gi, ' ');

        const tmp = document.createElement("DIV");
        tmp.innerHTML = htmlWithSpaces;
        return (tmp.textContent || tmp.innerText || "").trim();
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // 1. Fetch News
                const q = query(collection(db, "news"), orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);
                let fetchedNews = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // 2. Filter by User Preferences
                if (auth.currentUser) {
                    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        const prefs = userDoc.data().preferences;
                        if (prefs && prefs.newsImpacts && prefs.newsImpacts.length > 0) {
                            fetchedNews = fetchedNews.filter(item => prefs.newsImpacts.includes(item.impact));
                        }
                    }
                }

                if (fetchedNews.length > 0) {
                    setNews(fetchedNews);
                } else {
                    // Only show mock if NOT logged in or really empty? 
                    // If logged in and filter results in 0, we should probably show 0 (and a message), not mock data.
                    // But for now keeping simple logic to avoid breaking flow.
                    if (!auth.currentUser) setNews(MOCK_NEWS);
                    else setNews([]);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setNews(MOCK_NEWS);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
                        Market <span className="text-accent">News</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-400">
                        Stay ahead of the volatility with real-time economic updates.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-white py-20">Loading Earth-shaking Events...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map(item => (
                            <Link key={item.id} to={`/news/${item.id}`} className="block group">
                                <Card
                                    title={item.title}
                                    image={item.image}
                                    content={stripHtml(item.content)}
                                    subtitle={
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-xs">
                                                {item.timestamp?.seconds
                                                    ? new Date(item.timestamp.seconds * 1000).toLocaleDateString()
                                                    : (item.timestamp || new Date().toLocaleDateString())
                                                }
                                            </span>
                                        </div>
                                    }
                                    badges={[
                                        { text: item.impact, color: IMPACT_COLORS[item.impact] || 'bg-gray-800 text-white' },
                                        ...(item.affectedCurrencies || []).map(curr => ({
                                            text: curr,
                                            color: 'bg-surface border border-gray-700 text-white'
                                        }))
                                    ]}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
