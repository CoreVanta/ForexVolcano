import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Button from '../components/ui/Button';

const AnalysisDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysisPost = async () => {
            try {
                const docRef = doc(db, 'analysis', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                    // Check if it matches a mock ID for demo purposes if needed, otherwise redirect
                    navigate('/analysis');
                }
            } catch (error) {
                console.error("Error fetching analysis detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysisPost();
    }, [id, navigate]);

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
    }

    if (!post) return null;

    const formattedDate = post.timestamp?.seconds
        ? new Date(post.timestamp.seconds * 1000).toLocaleDateString()
        : (post.timestamp || new Date().toLocaleDateString());

    const directionColor = post.direction === 'Bullish' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary';

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/analysis')} className="mb-6 text-gray-400 hover:text-white">
                    ← Back to Analysis
                </Button>

                <article className="bg-surface rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    {(post.image || post.chart_image_url) && (
                        <div className="w-full h-64 sm:h-96 relative">
                            <img
                                src={post.image || post.chart_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                        </div>
                    )}

                    <div className="p-8 sm:p-12">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="text-gray-400 text-sm">{formattedDate}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-accent text-sm uppercase tracking-wider font-bold">
                                {post.analysisType || 'Technical Analysis'}
                            </span>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-surface border border-gray-700 text-white`}>
                                {post.pair}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${directionColor}`}>
                                {post.direction}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div
                            className="prose prose-invert prose-lg max-w-none text-gray-300 mb-16"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Meet Your Analyst Section */}
                        {(post.analystName || post.analystBio) && (
                            <div className="border-t border-gray-800 pt-12 mt-12 mb-8">
                                <h3 className="text-2xl font-bold text-white mb-8">Meet Your Analyst</h3>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-black/20 p-8 rounded-2xl border border-gray-800/50">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden ring-4 ring-primary/20">
                                        <img
                                            src={post.analystImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60'}
                                            alt={post.analystName || 'Analyst'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h4 className="text-xl font-bold text-white mb-2">{post.analystName || 'Volcano Analyst'}</h4>
                                        <p className="text-gray-400 leading-relaxed mb-4 whitespace-pre-wrap">
                                            {post.analystBio || 'Professional market analyst at Forex Volcano.'}
                                        </p>

                                        <div className="flex gap-4">
                                            {post.twitter && (
                                                <a href={post.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                                </a>
                                            )}
                                            {post.linkedin && (
                                                <a href={post.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                                </a>
                                            )}
                                            {post.telegram && (
                                                <a href={post.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default AnalysisDetail;
