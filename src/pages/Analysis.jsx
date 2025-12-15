import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const MOCK_ANALYSIS = [
    {
        id: '1',
        pair: 'EUR/USD',
        direction: 'Bearish',
        title: 'EUR/USD Forming Head and Shoulders on 4H',
        content: 'Price has failed to break the 1.0900 resistance level multiple times. We are observing a clear H&S pattern formation. If the neckline at 1.0820 breaks, we expect a sharp decline towards the 1.0750 liquidity zone.',
        author: 'Volcano Chief',
        timestamp: new Date().toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: '2',
        pair: 'XAU/USD',
        direction: 'Bullish',
        title: 'Gold Preparing for Eruption Above 2050',
        content: 'Geopolitical tensions and a weakening dollar suggest Gold is accumulating for a massive leg up. Watch for a retest of 2035 as a potential entry point for long positions targeting new highs.',
        author: 'Analyst Sarah',
        timestamp: new Date().toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: '3',
        pair: 'GBP/JPY',
        direction: 'Bullish',
        title: 'The Dragon is Waking Up',
        content: 'GJ is respecting the ascending trendline perfectly. The recent pullback to 182.00 was rejected strongly. We are looking for continuation towards 185.00 level.',
        author: 'Volcano Chief',
        timestamp: new Date().toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1526304640151-b59310398691?q=80&w=1000&auto=format&fit=crop'
    }
];

const Analysis = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const q = query(collection(db, "analysis"), orderBy("timestamp", "desc")); // Assuming timestamp field exists
                const querySnapshot = await getDocs(q);
                const fetchedPosts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                if (fetchedPosts.length > 0) {
                    setPosts(fetchedPosts);
                } else {
                    // Fallback to mock data if DB is empty
                    setPosts(MOCK_ANALYSIS);
                }
            } catch (error) {
                console.error("Error fetching analysis:", error);
                // Fallback to mock data on error (e.g. permission issues or offline)
                setPosts(MOCK_ANALYSIS);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    const filteredPosts = filter === 'All'
        ? posts
        : posts.filter(post => post.pair === filter);

    // Get unique pairs for filter
    const pairs = ['All', ...new Set(posts.map(p => p.pair))];

    const stripHtml = (html) => {
        if (!html) return "";
        const htmlWithSpaces = html.replace(/<\/p>/gi, ' ')
            .replace(/<\/div>/gi, ' ')
            .replace(/<br\s*\/?>/gi, ' ');
        const tmp = document.createElement("DIV");
        tmp.innerHTML = htmlWithSpaces;
        return (tmp.textContent || tmp.innerText || "").trim();
    };

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
                        Market <span className="text-primary">Analysis</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-400">
                        Daily technical breakdowns and trade setups from our experts.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {pairs.map(pair => (
                        <button
                            key={pair}
                            onClick={() => setFilter(pair)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${filter === pair
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-surface text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            {pair}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-white py-20">Loading Volcano Data...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => {
                            const directionColor = post.direction === 'Bullish' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary';

                            return (
                                <Link key={post.id} to={`/analysis/${post.id}`} className="block group">
                                    <Card
                                        title={post.title}
                                        image={post.image || post.chart_image_url}
                                        content={stripHtml(post.content)}
                                        subtitle={
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-xs">
                                                    {post.timestamp?.seconds
                                                        ? new Date(post.timestamp.seconds * 1000).toLocaleDateString()
                                                        : (post.timestamp || new Date().toLocaleDateString())
                                                    }
                                                </span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-gray-500 text-xs text-accent">By {post.author || 'Admin'}</span>
                                            </div>
                                        }
                                        badges={[
                                            { text: post.pair, color: 'bg-surface border border-gray-700 text-white' },
                                            { text: post.direction, color: directionColor }
                                        ]}
                                        footer={
                                            <Button variant="ghost" size="sm" className="w-full justify-between group-hover:text-white">
                                                Read Full Breakdown
                                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Button>
                                        }
                                    />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analysis;
