import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Button from '../components/ui/Button';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const docRef = doc(db, 'news', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setNewsItem({ id: docSnap.id, ...docSnap.data() });
                } else {
                    // Handle "Not Found" case, maybe check mock data if relevant, or just redirect
                    console.log("No such document!");
                    navigate('/news');
                }
            } catch (error) {
                console.error("Error fetching news detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsItem();
    }, [id, navigate]);

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
    }

    if (!newsItem) return null;

    const formattedDate = newsItem.timestamp?.seconds
        ? new Date(newsItem.timestamp.seconds * 1000).toLocaleDateString()
        : (newsItem.timestamp || new Date().toLocaleDateString());

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/news')} className="mb-6 text-gray-400 hover:text-white">
                    ← Back to News
                </Button>

                <article className="bg-surface rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    {newsItem.image && (
                        <div className="w-full h-64 sm:h-96 relative">
                            <img
                                src={newsItem.image}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                        </div>
                    )}

                    <div className="p-8 sm:p-12">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="text-gray-400 text-sm">{formattedDate}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${newsItem.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                                    newsItem.impact === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-green-500/20 text-green-400'}`}>
                                {newsItem.impact} Impact
                            </span>
                            {newsItem.affectedCurrencies && newsItem.affectedCurrencies.map && newsItem.affectedCurrencies.map(curr => (
                                <span key={curr} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                                    {curr}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 leading-tight">
                            {newsItem.title}
                        </h1>

                        <div
                            className="prose prose-invert prose-lg max-w-none text-gray-300"
                            dangerouslySetInnerHTML={{ __html: newsItem.content }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
};

export default NewsDetail;
